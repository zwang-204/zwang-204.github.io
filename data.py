import json

# Initialize the pixels data structure
pixels = {"pixels": []}

for i in range(10000):
    pixels["pixels"].append({
        "rgb": [255, 255, 255],
        "words": ""
    })

# Write the data to a JSON file
with open('pixels.json', 'w') as file:
    json.dump(pixels, file, indent=4)
