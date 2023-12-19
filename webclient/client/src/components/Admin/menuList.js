import {
	Archive,
	Chemistry,
	SettingsAdjust,
	ShareKnowledge,
	Document,
	BatchJob,
	Security,
	Translate,
	WatsonxAi
} from '@carbon/icons-react'



const CarbonMenuList = {
	Menu: [
		{
			title: 'Configurations',
			titleTranslate: 'menu.sections.configurations',
			icon: WatsonxAi,
			menuItem: [
				{
					title: 'Prompts',
					titleTranslate: 'menu.prompts',
					link: '/prompts'
				},
			]
		},
		{
			title: 'Documents',
			titleTranslate: 'menu.sections.documents',
			icon: Document,
			menuItem: [
				{
					title: 'Files',
					titleTranslate: 'menu.files',
					link: '/documents'
				},
				{
					title: 'Extracted Relations',
					titleTranslate: 'menu.relations',
					link: '/extracted_relations_live'
				}
			]
		},
		{
			title: 'Jobs',
			titleTranslate: 'menu.sections.jobs',
			icon: BatchJob,
			menuItem: [
				{
					title: 'Jobs',
					titleTranslate: 'menu.jobs',
					link: '/jobs'
				},
			]
		},
		// {
		// 	title: 'Administration',
		// 	titleTranslate: 'menu.sections.admin',
		// 	icon: Security,
		// 	menuItem: [
		// 		{
		// 			title: 'Users',
		// 			titleTranslate: 'menu.users',
		// 			link: '/users'
		// 		},
		// 		{
		// 			title: 'Roles',
		// 			titleTranslate: 'menu.roles',
		// 			link: '/roles'
		// 		},
		// 	]
		// },
	]
}


export default CarbonMenuList;