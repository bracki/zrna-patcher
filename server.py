from flask import Flask, escape, request
from flask_cors import CORS
import json
import zrna
from collections import namedtuple

ZrnaModule = namedtuple("ZrnaModule", ["id", "type", "parameters", "ports"])
ZrnaLink = namedtuple("ZrnaLink", "id source sourcePort target targetPort")
ZrnaPort = namedtuple("ZrnaPort", "id name")

app = Flask(__name__)
CORS(app)

z = zrna.api.Client()
z.connect()

# A dictionary of instantiated ZRNA modules
live_modules = {}

def circuit(data):
    """
    Build a ZRNA circuit from JSON data.
    The JSON data is build by serializing 'react-diagram's model.
    """
    links = data["model"]["layers"][0]['models']
    nodes = data["model"]["layers"][1]['models']

    zrna_modules = {}
    for id, node in nodes.items():
        print("Parameters:", node['parameters'])
        ports = {}
        for port in node['ports']:
            ports[port['id']] = ZrnaPort(id=port['id'], name=port['name'])
        zrna_modules[id] = ZrnaModule(type=node['zrnaType'], parameters=node['parameters'], id=id, ports=ports)

    zrna_links = {}
    for id, link in links.items():
        zrna_links[id] = ZrnaLink(id=id, source=link['source'], sourcePort=link['sourcePort'], target=link['target'], targetPort=link["targetPort"])

    z.pause()
    z.clear()

    # Initialize the module and set the clock
    for module in zrna_modules.values():
        class_ = getattr(z, module.type)
        live_modules[module.id] = class_()
        live_modules[module.id].set_clock(z.CLOCK3)
        z.add(live_modules[module.id])
        for p, v in module.parameters.items():
            setattr(live_modules[module.id], p, v)

    # Connect input/outputs
    for link in zrna_links.values():
        source = live_modules[link.source]
        target = live_modules[link.target]
        sourceModule = zrna_modules[link.source]
        targetModule = zrna_modules[link.target]
        source_port_name = sourceModule.ports[link.sourcePort].name
        target_port_name = targetModule.ports[link.targetPort].name
        sourcePort = getattr(source, source_port_name)
        targetPort = getattr(target, target_port_name)
        sourcePort.connect(targetPort)

    # Run the circuit
    z.set_divisor(z.CLOCK_SYS1, 4)
    z.run()

    # Print out modules and their connections
    for m in live_modules.values():
        print(m)
        for o in m.inputs:
            print(getattr(m, o).connected_to)
        for o in m.outputs:
            print(getattr(m, o).connected_to)

@app.route('/', methods=["POST"])
def func():
    print(request.json)
    circuit(request.json)
    return 'OK'

@app.route('/circuit/module/<module_id>/parameter/<parameter>', methods=["POST"])
def parameter(module_id, parameter):
    try:
        m = live_modules[module_id]
        setattr(m, parameter, request.json['value'])
        print(parameter)
        print(request.json)
        return 'OK'
    except KeyError:
        return "MEH"