username database
| Column       | Data Type | Description              |
|--------------|-----------|--------------------------|
| username     | text      | stores the username      |
| salt         | text      | returned by minicrypt    |
| hash         | text      | returned by minicrypt    |

reviewpage database
| Column       | Data Type | Description              |
|--------------|-----------|--------------------------|
| username     | text      | stores the username      |
| id           | serial    | unique id for the review which auto increments when you add new review    |
| dining       | int       | stores any of five numbers that correspond to the 5 dining halls at UMass |
| dish         | text      | stores the dish reviewed |
| review       | text      | description of the food reviewed |

Pari Yogesh- the initial set up of the username database, did 50% of the work for the passport functions, did the implementation of the hashing functions
Govind Chandak- bug fixed implementations, finished the passport functions and set up all functions required for the review page database and did the deployment


