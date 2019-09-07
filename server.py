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

def circuit(data):
    print(z)
    links = data["model"]["layers"][0]['models']
    nodes = data["model"]["layers"][1]['models']

    zrna_modules = {}
    for id, node in nodes.items():
        ports = {}
        for port in node['ports']:
            ports[port['id']] = ZrnaPort(id=port['id'], name=port['name'])
        zrna_modules[id] = ZrnaModule(type=node['zrnaType'], parameters=node['parameters'], id=id, ports=ports)

    zrna_links = {}
    for id, link in links.items():
        zrna_links[id] = ZrnaLink(id=id, source=link['source'], sourcePort=link['sourcePort'], target=link['target'], targetPort=link["targetPort"])

    z.pause()
    z.clear()
    live_modules = {}
    for module in zrna_modules.values():
        class_ = getattr(z, module.type)
        live_modules[module.id] = class_()
        live_modules[module.id].set_clock(z.CLOCK3)
        z.add(live_modules[module.id])

    for link in zrna_links.values():
        print("diese geile verbindiuggn", link)
        source = live_modules[link.source]
        target = live_modules[link.target]
        sourceModule = zrna_modules[link.source]
        print("source")
        print(sourceModule)
        targetModule = zrna_modules[link.target]
        print("target")
        print(targetModule)
        source_port_name = sourceModule.ports[link.sourcePort].name
        target_port_name = targetModule.ports[link.targetPort].name
        print("Connecting {0}.{1} to {2}.{3}".format(sourceModule.type, source_port_name, targetModule.type, target_port_name))

        sourcePort = getattr(source, source_port_name)
        targetPort = getattr(target, target_port_name)
        print(sourcePort.connect)
        sourcePort.connect(targetPort)

    print(z.nets())
    print(z.circuit())
    z.set_divisor(z.CLOCK_SYS1, 4)
    z.run()
    for m in live_modules.values():
        print(m)
        for o in m.inputs:
            print(getattr(m, o).connected_to)
        for o in m.outputs:
            print(getattr(m, o).connected_to)


@app.route('/', methods=["POST"])
def hello():
    print(request.json)
    circuit(request.json)
    return 'OK'
