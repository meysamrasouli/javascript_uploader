
    /**
     * @typedef {Object}
     * @property {int|string} id - image id (new image has N as id)
     * @property {string} title - title of image
     * @property {string} alt - alternative text of image
     * @property {string} des - description of image
     * @property {int} sel - choosen image (1: choosen, 0: not)
     * 
     * [{
     *      id: N,
     *      title: '',
     *      alt: '',
     *      des: '',
     *      sel: 1
     * }]
    */

    imageUploader('abc', {
        button: {
            upload: {// retuired
                text: 'Upload'// -> default: upload 
            },
            delete: {},// (optional)
            tag: {},// (optional)
            detail: {},// (optional)
        },
        name: 'productVarity',// required  
        fileFormat: [],// (optional) -> default: image extensions
        fileSize: {// (optional)
            min: 100,// (optional)
            max: 300,// (optional)
        },// (optional) -> default: image size
        multipleFile: true,// (optional) -> default: true
    },[
        {id:'4',title:'aaaa',alt:'ababab',des:'abcabc',sel:1,path:'https://picsum.photos/id/1/200/300'},
        {id:'5',title:'bbbb',alt:'bcbcbc',des:'bacbac',sel:0,path:'https://picsum.photos/id/1/200/300'},
    ])

    // imageUploader('abc', {
    //     // button: {
    //     //     upload: {// retuired
    //     //         text: 'Upload'// -> default: upload 
    //     //     },
    //     //     delete: {},// (optional)
    //     //     tag: {},// (optional)
    //     //     detail: {},// (optional)
    //     // },
    //     name: 'productVarity',// required  
    //     fileFormat: [],// (optional) -> default: image extensions
    //     multipleFile: true,// (optional) -> default: true
    // })



    //==================================================| Main
    /**
     * @function imageUploader
     * @param { string } id 
     * @param { Object } feature
     * @param { Array } [initialValue] (optional) [{id:'',title:'',alt:'',des:'',sel:'',path:''}]
     * @returns { void }
    */
    function imageUploader(id, feature, initialValue = null){
        let root = document.getElementById(id)
        root.classList.add('image-uploader')
        
        root.dataset.name = feature.name
        
        root.dataset.multipleFile = (feature.hasOwnProperty('multipleFile') && !feature.multipleFile) ? 0 : 1

        // file format validation
        if(feature.hasOwnProperty('fileFormat') && feature.fileFormat.length > 0)
            root.dataset.fileFormat = feature.fileFormat.join().toString()

        // file size validation
        if(feature.hasOwnProperty('fileSize') && Object.keys(feature.fileFormat).length > 0)
            root.dataset.fileSize = JSON.stringify(feature.fileSize)
        
        // make tags
        iuTagMaker(root, feature)

        // initial values (usually comes from database)
        if(initialValue)
            iuInitialValue(root, initialValue)
    }

    //==================================================| Constructors
    /** tag maker
     * @function iuTagMaker
     * @param { DOM } root (root element)
     * @param { Object } feature
     * @returns { void }
    */
    function iuTagMaker(root, feature){
        //------------------------------| button container maker
        iuTagMaker_button(root, feature)

        //------------------------------| image container maker
        iuTagMaker_image(root)

        //------------------------------| input container maker
        iuTagMaker_input(root)

        //------------------------------| notification container maker
        iuTagMaker_notification(root)
    }

    /** tag maker button section
     * @function iuTagMaker_button
     * @param { DOM } root (root element)
     * @param { Object } feature
     * @returns { void }
    */
    function iuTagMaker_button(root, feature){
        let buttons = []

        buttons.upload = document.createElement('label')
        buttons.upload.classList.add('iu-button-upload')
        buttons.upload.classList.add('iu-custom-button')
        buttons.upload.addEventListener('click', onclick_upload)
        buttons.upload.innerText = 'upload'

        if(feature.hasOwnProperty('button')){
            if(feature.button.hasOwnProperty('upload')){    
                buttons.upload.innerText = (feature.button.upload.hasOwnProperty('text')) ? feature.button.upload.text : 'upload'
            }
            if(feature.button.hasOwnProperty('delete')){
                buttons.delete = document.createElement('label')
                buttons.delete.classList.add('iu-button-remove')
                buttons.delete.classList.add('iu-custom-button')
                buttons.delete.innerText = (feature.button.delete.hasOwnProperty('text')) ? feature.button.delete.text : 'remove'
                buttons.delete.addEventListener('click', onclick_delete)
            }
            if(feature.button.hasOwnProperty('tag')){
                buttons.tag = document.createElement('label')
                buttons.tag.classList.add('iu-button-tag')
                buttons.tag.classList.add('iu-custom-button')
                buttons.tag.innerText = (feature.button.tag.hasOwnProperty('text')) ? feature.button.tag.text : 'tag'
                buttons.tag.addEventListener('click', onclick_tag)
            }
            if(feature.button.hasOwnProperty('detail')){
                buttons.detail = document.createElement('label')
                buttons.detail.classList.add('iu-button-detail')
                buttons.detail.classList.add('iu-custom-button')
                buttons.detail.innerText = (feature.button.detail.hasOwnProperty('text')) ? feature.button.detail.text : 'detail'
                buttons.detail.addEventListener('click', onclick_detail)
            }    
        }
        
        //------------------------------| container
        let buttonContainer = document.createElement('div') 
        buttonContainer.classList.add('iu-button-container')

        for(const index in buttons){
            buttonContainer.appendChild(buttons[index])
        }
        root.appendChild(buttonContainer)
    }
    /** tag maker image section
     * @function iuTagMaker_image
     * @param { DOM } root (root element)
     * @returns { void }
    */
    function iuTagMaker_image(root){
        //------------------------------| container
        let imageContainer = document.createElement('div') 
        imageContainer.classList.add('iu-image-container')
        
        let ul = document.createElement('ul') 
        imageContainer.appendChild(ul)

        root.appendChild(imageContainer)
    }
   /** tag maker input section
     * @function iuTagMaker_input
     * @param { DOM } root (root element)
     * @returns { void }
    */
    function iuTagMaker_input(root){
        //------------------------------| container
        let InputContainer = document.createElement('div') 
        InputContainer.classList.add('iu-input-container')

        // input detail
        let input_detail = document.createElement('input')
        input_detail.setAttribute('type', 'hidden')
        input_detail.setAttribute('class', 'iu-input-detail')
        input_detail.setAttribute('name', root.dataset.name + '[detail]')
        input_detail.setAttribute('value', '[]')
        InputContainer.appendChild(input_detail)

        // input delete
        let input_delete = document.createElement('input')
        input_delete.setAttribute('type', 'hidden')
        input_delete.setAttribute('class', 'iu-input-delete')
        input_delete.setAttribute('name', root.dataset.name + '[delete]')
        input_delete.setAttribute('value', '[]')
        InputContainer.appendChild(input_delete)

        root.appendChild(InputContainer)
    }
   /** tag maker notification section
     * @function iuTagMaker_notification
     * @param { DOM } root (root element)
     * @returns { void }
    */
    function iuTagMaker_notification(root){
        let notificationContainer = document.createElement('div')
        notificationContainer.classList.add('iu-notification-container')

        root.appendChild(notificationContainer)
    }

    /** make a modal for getting basic detail like: title, alt, description
     * @function iuModalMaker
     * @param { DOM } root (root element)
     * @param { int } imageIndex
     * @param { Object } initialInputValues (title , alt, des)
     * @returns { void }
    */
    function iuModalMaker(root, imageIndex, initialInputValues){
        // overlay
        let overlay = document.createElement('div')
        overlay.classList.add('iu-overlay')

        // modal
        let modal = document.createElement('div')
        modal.classList.add('iu-modal')

        // modal header
        let modal_header = document.createElement('div')
        modal_header.classList.add('iu-modal-header')
        let modal_headerTitle = document.createElement('span')
        modal_headerTitle.innerHTML = 'Image Details'
        let modal_headerClose = document.createElement('i')
        modal_headerClose.classList.add('fa','fa-times')
        modal_header.appendChild(modal_headerTitle)
        modal_header.appendChild(modal_headerClose)
        modal.appendChild(modal_header)

        // modal body
        let modal_body = document.createElement('div')
        modal_body.classList.add('iu-modal-body')
        // title
        let input_title = document.createElement('input')
        input_title.setAttribute('type', 'text')
        input_title.value = initialInputValues.title
        let label_title = document.createElement('label')
        label_title.innerHTML = 'Title'
        label_title.appendChild(input_title)
        // alt
        let input_alt = document.createElement('input')
        input_alt.setAttribute('type', 'text')
        input_alt.value = initialInputValues.alt
        let label_alt = document.createElement('label')
        label_alt.innerHTML = 'Alternative Text'
        label_alt.appendChild(input_alt)
        // description
        let input_description = document.createElement('input')
        input_description.setAttribute('type', 'text')
        input_description.value = initialInputValues.des
        let label_description = document.createElement('label')
        label_description.innerHTML = 'Description'
        label_description.appendChild(input_description)

        modal_body.appendChild(label_title)
        modal_body.appendChild(label_alt)
        modal_body.appendChild(label_description)
        modal.appendChild(modal_body)

        // modal footer
        let modal_footer = document.createElement('div')
        modal_footer.classList.add('iu-modal-footer')
        let button_save = document.createElement('button')
        button_save.setAttribute('type', 'button')
        button_save.classList.add('iu-button-save')
        button_save.classList.add('iu-custom-button')
        button_save.innerText = 'Save'
        let button_cancel = document.createElement('button')
        button_cancel.setAttribute('type', 'button')
        button_cancel.classList.add('iu-button-cancel')
        button_cancel.classList.add('iu-custom-button')
        button_cancel.innerText = 'Cancel'
        modal_footer.appendChild(button_save)
        modal_footer.appendChild(button_cancel)
        modal.appendChild(modal_footer)

        overlay.appendChild(modal)
        root.appendChild(overlay)

        // event listener
        button_save.addEventListener('click', function(){
            let inputContainer = root.querySelector('.iu-input-container')
            let detail = get_iuInputDetail(inputContainer)
            
            detail[imageIndex].title = input_title.value
            detail[imageIndex].alt = input_alt.value
            detail[imageIndex].des = input_description.value

            set_iuInputDetail(inputContainer, detail)

            overlay.remove()
        })
        // event listener
        overlay.addEventListener('click', function(el){            
            if(Array.from(el.target.classList).includes('iu-overlay'))
                overlay.remove()
        })
        button_cancel.addEventListener('click', function(){
            overlay.remove()
        })
    }

    /** initial value
     * @function iuInitialValue
     * @param { DOM } root - root element
     * @param { Array } initialValue
     * @returns { void }
    */
    function iuInitialValue(root, initialValue){
        const imageContainerUl = root.querySelector('.iu-image-container > ul')
        const inputContainer = root.querySelector('.iu-input-container')
        let detail = []

        initialValue.forEach((item, index) => {
            // making detail
            detail.push({
                id: item.hasOwnProperty('id') ? item.id : index,
                title: item.hasOwnProperty('title') ? item.title : '',
                alt: item.hasOwnProperty('alt') ? item.alt : '',
                des: item.hasOwnProperty('des') ? item.des : '',
                sel: item.hasOwnProperty('sel') ? item.sel : 0,
            })

            // making images
            let li = document.createElement('li')
            if(item.hasOwnProperty('path')){
                // get the file name from a full path
                li.innerHTML = "<img src='"+item.path+"'/><span>"+ item.path.replace(/^.*[\\/]/, '') +"</span>"
            }else{
                li.innerHTML = "<img src='' alt='no image'/><span>no image</span>"
            }
            
            // tag image 
            if(item.hasOwnProperty('sel') && item.sel === 1) li.classList.add('tag')
            // add click event
            li.addEventListener('click', onclick_li)
            // append image
            imageContainerUl.appendChild(li)
        })
        set_iuInputDetail(inputContainer, detail)
    }
    //==================================================| Events
    /** click on upload button
     * @event click
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onclick_upload(el){ 
        const tags = iuTagFinder(el)
        const uniqueCode = Date.now();// unique timestamp code for id

        // remove empty input if exist
        let inputFiles = tags.inputContainer.querySelectorAll('[type="file"]')
        if(inputFiles.length > 0){
            inputFiles.forEach((item) => {
                if(item.value === "") item.remove()
            })
        }
        
        // set for attribute for label
        el.target.setAttribute('for', uniqueCode)

        // create input file
        let input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('id', uniqueCode)
        input.setAttribute('name', tags.root.dataset.name + '[files][]')
        input.addEventListener('change', onchange_file)
        tags.inputContainer.appendChild(input)
    }

    /** click on delete button
     * @event click (delete)
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onclick_delete(el){
        const tags = iuTagFinder(el)
        const li = tags.imageContainerUl.querySelector('li.selected')
        let detail = get_iuInputDetail(tags.inputContainer)

        // clear notification
        set_iuNotification(tags.notificationContainer, "")

        // ERROR: nothing is selected
         if(!li) {
            set_iuNotification(tags.notificationContainer, "Error: nothing is selected")
            return false
         }
         
        // find selected index
        let selectedIndex = null
        tags.imageContainerUl.querySelectorAll('li').forEach((item, index) => {
            if(Array.from(item.classList).includes('selected'))
                selectedIndex = index
        })
        
        // check selected li id, to see whether it come from DB or it's new
        if(!isNaN(detail[selectedIndex]['id'])){// comes from DB
            // put it's id in input delete
            set_iuInputDelete(tags.inputContainer, detail[selectedIndex]['id'])
        }else{// new: remove the new input file     
            // find the index of new input file if there are items which come from DB
            let newIndexCounter = -1
            detail.forEach((item, index) => {
                if(index <= selectedIndex && isNaN(item.id))
                    newIndexCounter++
            })    
            tags.inputContainer.querySelectorAll('input[type="file"]')[newIndexCounter].remove()
        }

        // remove the item from detail
        detail.splice(selectedIndex, 1)
        set_iuInputDetail(tags.inputContainer, detail)

        // remove selected li
        li.remove()

        set_iuNotification(tags.notificationContainer, "Item removed")
    }

    /** click on tag button
     * @event click
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onclick_tag(el){
        const tags = iuTagFinder(el)
        const li = tags.imageContainerUl.querySelector('li.selected')
        let detail = get_iuInputDetail(tags.inputContainer)

        // clear notification
        set_iuNotification(tags.notificationContainer, "")

        // ERROR: nothing is selected
        if(!li) {
            set_iuNotification(tags.notificationContainer, "Error: nothing is selected")
            return false
         }
         set_iuNotification(tags.notificationContainer, "")

        // find the selected li and tag it
        if(! Array.from(li.classList).includes('tag')){// selected li is not tagged, add tag class
        
            // search for previous tagged li and remove the tag 
            li.closest('ul').querySelectorAll('li').forEach((item, index) => {

                // remove previous tagged li
                if(Array.from(item.classList).includes('tag')){
                    detail[index]['sel'] = 0
                    set_iuInputDetail(tags.inputContainer, detail)
                    item.classList.remove('tag')
                }

                // add tag to selected li
                if(Array.from(item.classList).includes('selected')){
                    detail[index]['sel'] = 1
                    set_iuInputDetail(tags.inputContainer, detail)
                    item.classList.add('tag')
                    set_iuNotification(tags.notificationContainer, "Selected item is tagged")
                }
            })
        }else{// selected li has tag class, remove tag class
            li.classList.remove('tag')
            set_iuNotification(tags.notificationContainer, "Item's tag is removed")
        }
    }

    /** click on detail button
     * @event click 
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onclick_detail(el){
        const tags = iuTagFinder(el)
        const li = tags.imageContainerUl.querySelector('li.selected')
        let detail = get_iuInputDetail(tags.inputContainer)

        // clear notification
        set_iuNotification(tags.notificationContainer, "")

        // ERROR: nothing is selected
         if(!li) {
            set_iuNotification(tags.notificationContainer, "Error: nothing is selected")
            return false
         }

        let selectedIndex = null
        li.closest('ul').querySelectorAll('li').forEach((item, index) => {
            if(Array.from(item.classList).includes('selected')) 
                selectedIndex = index
        })

        iuModalMaker(tags.root, selectedIndex, detail[selectedIndex])
    }

    /** file is selected from file dialog
     * @event change
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onchange_file(el){
        const tags = iuTagFinder(el)
        let multipleFileUpload = (tags.root.dataset.multipleFile === undefined || tags.root.dataset.multipleFile !== "0")
        let detail = get_iuInputDetail(tags.inputContainer)

        // clear notification
        set_iuNotification(tags.notificationContainer, "")

        // ERROR: there is no file
        if (!el.target.files || !el.target.files[0]){
            set_iuNotification(tags.notificationContainer, "Error: there is no file")
            return false
        }

        // validate extention
        if(tags.root.dataset.fileFormat){
            // get file extention
            let extensionArray = el.target.files[0].name.split('.');
            let extensions = extensionArray[extensionArray.length - 1];

            let validExtensions = tags.root.dataset.fileFormat.split(',')

            // ERROR: invalid extention
            if(!validExtensions.includes(extensions)){
                set_iuNotification(tags.notificationContainer, "Error: invalid extention")
                return false
            }
        }

        // validate size KB
        if(tags.root.dataset.fileSize){
            let fileSize = (el.target.files[0].size / 1024).toFixed() //size in KB
            let validSize = JSON.parse(tags.root.dataset.fileSize)
            
            // if(validSize.hasOwnProperty('min') && fileSize  validSize){
            //     set_iuNotification(tags.notificationContainer, "Error: invalid file size, "+validSize+"/"+fileSize)
            //     return false
            // }
            // if(validSize.hasOwnProperty('max') && fileSize  validSize){
            //     set_iuNotification(tags.notificationContainer, "Error: invalid file size, "+validSize+"/"+fileSize)
            //     return false
            // }
        }
            
        // upload only single file 
        if(!multipleFileUpload){

            // there is a file - (delete it for replacement)
            if(detail.length > 0){

                if(detail[0]['id'].includes('N')){
                    // remove previous new input file
                    tags.inputContainer.querySelector("input[type='file']").remove()
                }else{
                    // stored image in database - put the image_id in delete input
                    set_iuInputDelete(tags.inputContainer, detail[0]['id'])
                }

                detail = []// empty detail
                tags.imageContainerUl.innerHTML = ""// remove image tag
            }
        }

        // update detail
        detail.push({
            id: 'N',
            title: '',
            alt: '',
            des: '',
            sel: 0,
        })
        set_iuInputDetail(tags.inputContainer, detail)

        // make new li and image
        let reader = new FileReader()
        reader.onload = function (e) {
            let li = document.createElement('li')
            li.innerHTML = "<img src='"+e.target.result+"'/><span>"+el.target.files[0].name+"</span>"
            li.addEventListener('click', onclick_li)
            tags.imageContainerUl.appendChild(li)
        }
        reader.readAsDataURL(el.target.files[0]);

        // upload is finished - clean up
        el.target.removeAttribute('id')
        tags.buttonContainer.querySelector('.iu-button-upload').removeAttribute('for')

        set_iuNotification(tags.notificationContainer, "New item is added")
    }

    /** selecting an image
     * @event click 
     * @param { PointerEvent } el
     * @returns { void }
    */
    function onclick_li(el){
        let ul = el.currentTarget.closest('ul')
        let root = ul.closest('div.image-uploader')
        let notificationContainer = root.querySelector('.iu-notification-container')

        if(!Array.from(el.currentTarget.classList).includes('selected')){// already selected, deselect    
            ul.querySelectorAll('li').forEach((item) => {
                item.classList.remove('selected')
            })

            el.currentTarget.classList.add('selected')
            set_iuNotification(notificationContainer, "An item is selected")
        }else{
            el.currentTarget.classList.remove('selected')
            set_iuNotification(notificationContainer, "Item is deselected")
        }
    }

    //==================================================| Functions
    /**
     * return four main tag of component
     * @function iuTagFinder
     * @param { PointerEvent } el
     * @returns { Object }
    */
    function iuTagFinder(el){
        let root = el.target.closest('div.image-uploader')
    
        return {
            root: root,
            imageContainerUl: root.querySelector('.iu-image-container > ul'),
            inputContainer: root.querySelector('.iu-input-container'),
            buttonContainer: root.querySelector('.iu-button-container'),
            notificationContainer: root.querySelector('.iu-notification-container'),
        }
    }

    /** get input detail 
     * @function get_iuInputDetail 
     * @param { PointerEvent } el
     * @returns { Object }
    */
    function get_iuInputDetail(inputContainer){
        let input = inputContainer.querySelector('.iu-input-detail')
        return JSON.parse(input.value)
    }

    /** set input detail
     * @function set_iuInputDetail
     * @param { DOM } inputContainer
     * @param { Object } detail
     * @returns { void }
    */
    function set_iuInputDetail(inputContainer, detail){
        let input = inputContainer.querySelector('.iu-input-detail')
        input.value = JSON.stringify(detail)
    }

    /** set input delete
     * @function set_iuInputDelete
     * @param { DOM } inputContainer
     * @param { int } index
     * @returns { void }
    */
    function set_iuInputDelete(inputContainer, index){
        let input = inputContainer.querySelector('.iu-input-delete')
        let deleteArray = JSON.parse(input.value)
        deleteArray.push(index)
        input.value = JSON.stringify(deleteArray)
    }

    /** set notification message
     * @function set_iuNotification
     * @param { DOM } notificationContainer
     * @param { string } message
     * @returns { void }
    */
    function set_iuNotification(notificationContainer, message){
        notificationContainer.innerHTML = message
    }
