/* eslint-disable import/no-anonymous-default-export */
/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import chineseMessages from 'ra-language-chinese-new'

export default {
  ...chineseMessages,
  ra_custom: {
    action: {
      open: '打开',
      close: '圈闭',
      upload: '上传',
      import: '进口',
    },
    notification: {
    },
    fields: {
      comments: 'Free-form text comments for this item.',
    },
    no_data: '< No Data />',
  },
  breadcrumbs: {
    root: '主页',
  },
  copyright: 'Copyright 2023 IBM Corp.',
  menu: {
    header: '大本营',
    posts: '帖子',
    comments: '评论',
    albums: '相册',
    photos: '照片',
    sections: {
      blog: '博客',
      photos: '相片',
    },
  },
  resources: {
    
    posts: {
      name: '帖子',
      fields: {
        id: '帖子 ID',
        name: '帖子',
        comments: '评论',
        body: 'Body',
        title: '帖子头条',
        userId: '作家'
      },
      pages: {
        create: '新帖子',
        single: '帖子',
        upload: '上传帖子',
      },
      no_data: 'No posts defined',
      no_data_hint: 'Create a new post',
    },
    comments: {
      name: 'Post Comments',
      fields: {
        id: 'Comment ID',
        name: 'Commentor Name',
        body: 'Comment',
        email: 'Email',
        user: 'Commenter'
      },
      pages: {
        create: 'New Comment',
        single: 'Comment',
        upload: 'Upload Comments',
      },
      no_data: 'No comments defined',
      no_data_hint: 'Create a new comment',
    },
    albums: {
      name: 'Albums',
      fields: {
        id: 'Album ID',
        name: 'Album Name',
        title: 'Album Title',
        userId: 'Album Owner'
      },
      pages: {
        create: 'New Album',
        single: 'Album',
        upload: 'Upload Albums',
      },
      no_data: 'No Albums defined',
      no_data_hint: 'Create a new Album',
    },
    photos: {
      name: 'Photos',
      fields: {
        id: 'Photo ID',
        name: 'Photo Name',
        title: 'Photo Title',
        userId: 'Photo Owner',
        url: 'Photo URL',
        thumbnailUrl: 'Photo Thumbnail'
      },
      pages: {
        create: 'New Photo',
        single: 'Photo',
        upload: 'Upload Photos',
      },
      no_data: 'No Photos defined',
      no_data_hint: 'Create a new Photo',
    },
  },
}
