from Naked.toolshed.shell import execute_js, muterun_js
import string

#must have "Naked" module installed, tested using version 0.1.31
#pip install Naked

# This module uses "Naked" to run convertExcelToJs.js file which creates a JSON object file from 
# distObjects.xlsx spreadsheet.   Then file is opened from python and nozzleLibrary variable is assigned
# to object.

response = muterun_js("convertExcelToJs.js")
if response.exitcode == 0:
    #if script executed without error then
  print("Script ran correctly.")
  #print(response.stdout)

  ## add var distributorLibrary to file so that object imports correctly into program
  #with open("../data/data.js","r+") as f:
  #  old = f.read() # read everything in the file
  #  f.seek(0) # rewind
  #  f.write("var distributorLibrary =" + old) # write the new line before
  #  f.close()

  #with open("../data/output.js", "r+") as f:
  #    old = f.read()
  #    s = f.replace("{ 'NOZZLE-FLO':\n   ", 'var distributorLibrary = ')
  #    f.seek(0)
  #    f.write(s)
  #    f.close()
  
  s = open("../data/output.js").read()
  #s = s.replace("{ 'NOZZLE-FLO':\n   ", "var distributorLibrary = ")
  sLength = len(s)
  s = "var distributorLibrary = " + s[18:sLength-2] + ";"
  #print(s)
  f = open("../data/data.js", "w")
  f.write(s)
  f.close()
else:
  sys.stderr.write(response.stderr)



