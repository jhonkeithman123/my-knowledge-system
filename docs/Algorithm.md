# Knowledge Management System Algorithm

## Start

1. Display: "Welcome to Knowledge Management System"

## Step 1: Input Topic?

- **Decision**
  - If **No**:
    - Enter **View Mode**
    - Display: "Welcome to Knowledge Management System"
    - Show existing topics and concepts from database
    - Go back to Start
  - If **Yes**:
    - Proceed to Database Process

## Step 2: Database Process (Topic)

- Insert new topic into `topics` table
- Retrieve and display the topic

## Step 3: Insert Concept and Description?

- **Decision**
  - If **No**:
    - Enter **View Mode**
    - Display: "Welcome to Knowledge Management System"
    - Show existing topics and concepts
    - Go back to Start
  - If **Yes**:
    - Proceed to Database Process (Concept)

## Step 4: Database Process (Concept)

- Insert concept + description into `concepts` table
- Link concept to topic via `topic_id`
- Retrieve and display updated topic with concepts

## Step 5: Display Output

- Show topic with all associated concepts and definitions
- Return to Start
