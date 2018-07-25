from Naked.toolshed.shell import execute_js, muterun_js

#must have "Naked" module installed, tested using version 0.1.31
#pip install Naked

# This module uses "Naked" to run convertExcelToJs.js file which creates a JSON object file from 
# distObjects.xlsx spreadsheet.   Then file is opened from python and nozzleLibrary variable is assigned
# to object.

response = muterun_js("convertExcelToJs.js")
if response.exitcode == 0:
    #if script executed without error then
  print("Script ran correctly.")
  print(response.stdout)

  # add var distributorLibrary to file so that object imports correctly into program
  with open("../data/data.js","r+") as f:
    old = f.read() # read everything in the file
    f.seek(0) # rewind
    f.write("var distributorLibrary =" + old) # write the new line before
    f.close()
else:
  sys.stderr.write(response.stderr)



