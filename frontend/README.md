## Frontend

This app is independant of Kudosbot.
It only requests data from Kudosbot's API.

### Get started
1. Clone or download "frontend" folder
2. run "yarn dev" in "frontend"
3. run "node server.js" in "frontend/mock-api"


### TODO
#### cudos-ticker animation
  1. Elements should move in from the right and disspear on the left.
  2. There should be no space between the elements (other than infront of first element and behind the last element).    
     |-----[div][div][div][div]--------|
  3. No element should overlap.
  4. All elements must move at the same velocity.
  5. The animation must loop ASAP without violating any rules above.
