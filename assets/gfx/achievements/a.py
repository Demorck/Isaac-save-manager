import os
import re

def rename_images(directory):
    # Regex pattern to match the desired filenames
    pattern = re.compile(r"fandom115452-(\d+)\.png")
    
    # Iterate through the files in the specified directory
    for filename in os.listdir(directory):
        match = pattern.match(filename)
        if match:
            # Extract the number from the filename
            number = int(match.group(1)) + 1
            # Create the new filename
            new_filename = f"{number}.png"
            # Construct the full old and new paths
            old_path = os.path.join(directory, filename)
            new_path = os.path.join(directory, new_filename)
            # Rename the file
            os.rename(old_path, new_path)
            print(f"Renamed '{filename}' to '{new_filename}'")



rename_images(".")