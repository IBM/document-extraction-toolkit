/* eslint-disable import/no-anonymous-default-export */
/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import englishMessages from 'ra-language-english'

export default {
  ...englishMessages,
  ra_custom: {
    action: {
      open: 'Open',
      close: 'Close',
      upload: 'Upload',
      import: 'Import',
      read: 'Read',
      relations: 'Relations'
    },
    notification: {
    },
    fields: {
      comments: 'Free-form text comments for this item.',
    },
    no_data: '< No Data />',
  },
  breadcrumbs: {
    root: 'Home',
  },
  copyright: 'Copyright 2023 IBM Corp.',
  menu: {
    header: 'Document Extraction Toolkit',
    files: 'Files',
    relations: 'Extracted Relationships',
    jobs: 'Job Status',
    users: 'Users',
    roles: 'Roles',
    prompts: 'Prompts',
    sections: {
      documents: 'Documents',
      configurations: 'Configurations',
      jobs: 'Jobs',
      admin: 'Administration',
      logs: 'Logs',
    },
  },
  resources: {
    extracted_relations_live: {
      name: 'Extracted Relationships',
      fields: {
        id: 'Relationship ID',
        doc_id: 'Document ID',
        user_id: 'User ID',
        needs_review: 'Needs Review',
        comments: 'User Comments',
      }
    },
    documents: {
      name: 'Documents',
      fields: {
        id: 'Document ID',
        role_id: 'Role',
        user_id: 'User ID',
        page_length: 'Page Length',
      },
      headers: {
        document_files: 'PDF Files'
      }
    },
    users: {
      name: 'Users',
      fields: {
        id: 'Document ID',
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'Email',
        company: 'Company',
      }
    },
    jobs: {
      name: 'Job Status',
      fields: {
        id: 'Job ID',
        role_id: 'Role',
        user_id: 'User ID',
        doc_id: 'Document ID',
        percentage_loaded: 'Percent Loaded',
        task_status: 'Task Status',
      },
      headers: {
        document_files: 'Jobs'
      }
    },
    roles: {
      name: 'Roles',
      fields: {
        id: 'Role ID',
        name: 'Name',
        description: 'Description',
      },
      headers: {
        document_files: 'Roles'
      }
    },
    prompts: {
      name: 'Prompts',
      fields: {
        id: 'Prompt ID',
        name: 'Name',
        prompt_type: 'Prompt Type',
        model_name: 'Model Name',
        model_configuration: 'Model Configuration',
        'model_configuration.min_new_tokens': 'Minimum New Tokens',
        'model_configuration.max_new_tokens': 'Maximum New Tokens',
        'model_configuration.temperature': 'Temperature',
        
        model_configuration: 'Model Configuration',
        template: 'Prompt Template',
        questions: 'Prompt Questions',
        user_id: 'User ID',
        updated_at: 'Updated At',
        created_at: 'Created At',
      },
      headers: {
        document_files: 'Jobs'
      }
    },
  },
}
