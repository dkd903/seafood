# seafood

A sample app to process seafood data and display it in a meaning full chart visualization.

Before deploying, open assets/js/scripts.js and update baseUrl

Demo: http://cloud.supportally.com/2U2S0k343D34

About the dataset - The dataset had to be fixed inorder to add quotes to the object keys. This would have been taken care normally by the serverside. However, as this is a client side app only, the JSON needs to be in corect format.

About Code - 

1. Chose JavaScript as it would be the fastest and easiest as the language offers both data retrieval, manipulation and visualization. It fit the bill given the turnaround time.

2. Chose D3 as the library because it was mentioned once that UCN makes use of D3 on many of its apps, so I thought this would be a good chance to demonstrate my ability to work with D3. Other option would be chartjs.

3. There are some null guards that could be added in the code in script.js - I have left TODOs in comments.

4. General optimisations (for things like D3 init and the d3 axis data json generation, etc.) and checks for JSON property handling could have been added, given the time.

Where was the time spent - 

1. about 20 minutes reading throught the app task and going throught the data set
2. about 10 - 15 minutes laying the ground work, thinking about gathering libraries for the project
3. Rest was spent in coding the app, fixing bugs and adding enhancements.
