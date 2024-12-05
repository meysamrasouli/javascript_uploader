# An image uploader component with vanilla javascript

## About
This is a simple and easy to use file uploader component for uploading one or more files at the time. This component consists of CSS and JS files which works without external libraries.

## How to use
**STEP 1:**  move CSS and JS files into your project  
**STEP 2:**  create an empty <div> tag with an ID like "iuc" (image uploader container)   
**STEP 3:**  call "imageUploader()" function  
**STEP 4:**  use "iuc" as first parameter to identify the <div> tag  
**STEP 5:**  use an object to define the component's features   
**STEP 6:**  use an array of objects for files that have already been uploaded   
As simple as that :)

## Parameters
**Id (required):**  ID of an empty <div> to identify it in the HTML body   
**Feature (required):**  Feature is the structure of the component which is include of **Buttons** of file uploader, **Name** of the component for sending data to server-side, **Allowed Format** which helpes validate files before upload and **Multiple File** which defines whether a single or multiple files can be uploaded.   

***button:*** it supports four different buttons including upload, delete, tag and detail. upload button for adding files to the component, delete button for removing, tag is for choosing a file as selected one and detail button is for take SEO detail such title, alt and description of image. this property is optional with upload button as default button. each button has **text** property for changing the text of button.
***name:*** name of the component for sending data to server-side.   
***allowedFormat:*** an array of image extensions for validation
***multipleFile:*** a feature to define whether this component can upload a single or multiple files

```javascript
{
    button: { // (optional)
        upload: { // (optional) - upload is default
            text: 'add',// (optional) - text of button -> default text: upload
        },
        delete: {},// (optional) -> default text: delete
        tag: {},// (optional) -> default text: tag
        detail: {},// (optional) -> default text: detail
    },
    name: 'iuc', // (required) - name of the component for sending data to server-side
    allowedFormat: [],// (optional) - an array of image extensions for validation
    multipleFile: true,// (optional) - true: multiple file | false: single file -> default: true

}
```

**Initial Value (optional):** an array object to define images that have already uploaded
```javascript
    [
        {
            id:'12',// id of image which has already store in server-side
            title:'random',// image title
            alt:'random image',// image alternative text
            des:'this is a random image',// image description
            sel:1,// chosen image - there are times that you want to choose an image among the rest for a purpose
            path:'https://picsum.photos/id/1/200/300'
        },
        {
            id:'13',
            title:'test',
            alt:'test image',
            des:'this is a test image',
            sel:0,// it is not chosen
            path:'https://picsum.photos/id/1/200/300'
        },
    ]
```

## Server side
on server-side, the output of this component can be get with the ***name*** property that has been declared in the feature section. After submitting, if you chosen the 'product' as a name of the ***name*** feature for the component, you will have file (contains array of new file objects), detail (contains array of all images) and delete (contains arrays of ids of deleted images which has been already uploaded). the below example shows what you will get on server-side:

```javascript
    product: {
        file: [ fileObject ],// an array or files object
        detail: [// detail of each image
            {
                id: '12',// this image has already stored and 12 is the database id
                title: 'tablet main',
                alt: 'tablet ABC',
                des: 'this is a unique tablet',
                sel: 1,// chosen image
            },{
                id: 'N',// this is a new image that just uploaded
                title: '',
                alt: '',
                des: '',
                sel: 0,// it is not chosen
            }
        ],
        delete: [13]
    }
```
when you get the data on server-side, loop through the ***detail*** property and check the id of each item in the array, if the id has ***Number***, then it means that it this details belongs to the image that has been already uploaded, but if the id has ***N***, then it means that this is a new file and you have to check the ***file*** property. uploaded files with database id is always come before new files in array of ***detail*** property.
in order to access new files object that just uploaded, you can find them in the ***file*** property in the order they were uploaded.
deleted files with database id can be found in the ***delete*** property.

## Examples
***Simple use case for create page***
```javascript
    imageUploader('imageContainer', {
        button: {
            upload: {},
            delete: {},
            detail: {},
        },
        name: 'product',
        allowedFormat: ['jpg','png'],
    })
```

***A use case for edit page***
```javascript
    imageUploader('imageContainer', {
        button: {
            upload: {},
            delete: {},
            detail: {},
        },
        name: 'product',
        allowedFormat: ['jpg','png'],
    },[
        {
            id:'12', 
            title:'tablet main image', 
            alt:'tablet ABC', 
            des:'this is a unique tablet', 
            sel:1, 
            path:'https://picsum.photos/id/1/200/300'
        },{
            id:'13', 
            title:'tablet side image', 
            alt:'tablet ABC', 
            des:'this is a unique tablet', 
            sel:0, 
            path:'https://picsum.photos/id/1/200/300'
        }
    ])
```


