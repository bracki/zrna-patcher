import zrna
import json

z = zrna.api.Client()
z.connect()
modules = z.modules()
d = [] 
for mod in modules:
    class_ = getattr(z, mod)
    instance = class_()
    m = {}
    options = []
    for o in instance.options:
        option = getattr(instance, o)
        options.append(dict(valid_values=option.valid_values, wption=o))
    m["options"] = options 
    m["parameters"]= instance.parameters
    m["inputs"]= instance.inputs
    m["outputs"]= instance.outputs
    m["type"]=mod
    d.append(m)
    
print(json.dumps(d))