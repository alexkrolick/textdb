# TextDB

A database editor for structured text files

## Roadmap

- Schema:
  - Based on YML
  - Schema files describe possible fields for data files and how to edit,validate, & display them
  - Types:
    - plaintext
    - markdown
    - number
    - date
    - duration
    - pointer (link/ref to another file or URI)
    - typed array (e.g., array of markdown fields or pointers)
    - checklist
    - datestamp (\*hard to guarantee integrity if editing outside)
    - freeform? raw yml
    - embedded schema? adhoc typed fields
  - Extensions:
    - Allow defining new types with edit/validate/display widgets
- Editor:

  - [x] Open a folder
  - [x] Remember last folder location on startup
  - [x] Show all files in list
  - [x] Open a specific file
  - [ ] Define a schema file that applies to whole directory
  - [ ] Allow files to reference a specific schema
  - [ ] Include some base schema types, allow ref without local schema file (e.g., recipe, journal, todolist)
  - [ ] "New" (from schema) create a file from schema

    - [ ] Default values/non-null fields
    - [ ] Smart templates (reference current date?)

  - [ ] Click anywhere modify
  - [ ] Don't autosave (have a save button)?
  - [ ] Autoname new files with something easy to use
  - [ ] Schema editor (schema for schemas)
  - [ ] Attachment manager
  - [ ] Search features
    - [ ] Quicksearch file name
    - [ ] Structured search, based on field
    - [ ] Create and save an index file?
    - [ ] Smart re-index based on file system metadata (last changed)?
    - [ ] Partial re-index? Only traverse newly-changed files.
    - [ ] Content hash index - detect changes outside TextDB program (e.g. to validate modified_at integrity)
  - [ ] Bulk operations
    - [ ] Filter/search => update selection
    - [ ] Schema migration
