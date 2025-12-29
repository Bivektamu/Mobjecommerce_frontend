import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { ProductInput, Colour, Size, ValidateSchema, FormError, Status, Action, ProductImageInput, Toast, Toast_Vairant } from '../../store/types'
import validateForm from '../../utils/validate';
import Close from '../ui/Close';
import { useStoreDispatch } from '../../store';
import { addProduct, useProduct } from '../../store/slices/productSlice';
import { Navigate } from 'react-router-dom';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { addToast } from '../../store/slices/toastSlice';

import { Types } from 'mongoose';

interface PrviewImage {
    id: Types.ObjectId,
    src: string
}

const initial: ProductInput = {
    title: 'Test',
    sku: 'TETS123',
    price: 987,
    imgs: [],
    slug: 'test',
    colors: [Colour.BLACK],
    stockStatus: true,
    sizes: [Size.LARGE],
    quantity: 980,
    description: 'test',
    featured: false,
    category: 'test'
}

// const initial: ProductInput = {
//     title: '',
//     sku: '',
//     price: null,
//     imgs: [],
//     slug: '',
//     colors: [],
//     stockStatus: false,
//     sizes: [],
//     quantity: null,
//     description: '',
//     featured: false,
//     category: ''
// }

const MAX_FILE_SIZE = 1

const AddProduct = () => {

    const dispatch = useStoreDispatch()

    const { status, action, error } = useProduct()


    const [formData, setFormData] = useState<ProductInput>(initial)
    const [formErrors, setFormErrors] = useState<FormError>({})
    const [imgPreviews, setImagePreviews] = useState<PrviewImage[]>([])

    const { title, sku, price, imgs, slug, colors, stockStatus, sizes, quantity, description, category } = formData


    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            Object.keys(formData).map(key => {
                if (formData[key as keyof ProductInput]) {
                    setFormErrors(prev => ({ ...prev, [key]: '' }))
                }

            })
        }
    }, [formData])

    useEffect(() => {
        if (error) {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.WARNING,
                msg:error.message
            }
            dispatch(addToast(newToast))
        }
    }, [error])

    useEffect(() => {

        if (imgs.length > 0) {

            const previews: PrviewImage[] = []


            imgs.forEach((productImg: ProductImageInput) => {
                const reader = new FileReader();

                reader.onload = () => {
                    if (reader.result) {
                        const newPreview: PrviewImage = {
                            id: productImg._id,
                            src: reader.result as string
                        }
                        previews.push(newPreview);
                        if (previews.length === imgs.length) {
                            setImagePreviews(previews);
                        }
                    }
                };
                reader.readAsDataURL(productImg.img as File);
            })
        }
        else {
            setImagePreviews([])
        }
    }, [imgs])


    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.stopPropagation()

        let val: string | string[] | ProductImageInput[] | boolean | number

        if (e.target.type === 'file') {

            const event = e.target as HTMLInputElement
            const files: FileList = event.files as FileList
            val = [...imgs] as ProductImageInput[]
            for (let i = 0; i < files!.length; i++) {
                const maxSize = MAX_FILE_SIZE * 1024 * 1024
                if (files[i].size > maxSize) {
                    const newToast: Toast = {
                        id: v4(),
                        variant: Toast_Vairant.WARNING,
                        msg: `Please upload image less than ${MAX_FILE_SIZE} MB`
                    }
                    dispatch(addToast(newToast))
                }
                else {
                    const file: ProductImageInput = {
                        _id: new Types.ObjectId(),
                        img: files![i]
                    }
                    val.push(file)
                }
            }

        }
        else if (e.target.type === 'checkbox') {
            const event = e.target as HTMLInputElement

            if (event.checked) {
                if (event.name === 'colors') {
                    val = [...colors, event.value.toUpperCase()]
                }
                else if (event.name === 'sizes') {
                    val = [...sizes, event.value.toUpperCase()]
                }
                else {
                    val = event.checked
                }

            }
            else {
                if (event.name === 'colors') {
                    val = [...colors.filter(color => color !== event.value.toUpperCase())]
                }
                else if (event.name === 'sizes') {
                    val = [...sizes.filter(size => size !== event.value.toUpperCase())]
                }
                else {
                    val = event.checked
                }
            }


        }
        else {
            val = e.target.value
            if (parseInt(val)) {
                val = parseInt(val)
            }

        }
        let updateData = {
            [e.target.name]: val
        }

        if (e.target.name === 'stockStatus') {
            if (val) {
                val = true
            }
            else {
                val = false
            }
            updateData = {
                [e.target.name]: val
            }
        }
        else if (e.target.name === 'title') {
            let newSlug: string = val as string
            newSlug = newSlug.replace(/\s+/g, "-");
            updateData.slug = newSlug.toLowerCase()
        }

        setFormData(prev => ({
            ...prev,
            ...updateData
        }))
    }

    const previewHandler = (e: MouseEvent<HTMLButtonElement>, id: Types.ObjectId) => {
        e.preventDefault()
        e.stopPropagation()
        const updateImgs = [...imgs]
        const index = updateImgs.findIndex(img => img._id === id)
        updateImgs.splice(index, 1)

        setFormData(prev => ({ ...prev, imgs: [...updateImgs] }))
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        const validateSchema: ValidateSchema<unknown>[] =
            [
                {
                    name: 'title',
                    type: 'text',
                    value: title
                },
                {
                    name: 'description',
                    type: 'text',
                    value: description
                },
                {
                    name: 'sku',
                    type: 'alphaNumeric',
                    value: sku
                },
                {
                    name: 'price',
                    type: 'number',
                    value: price
                },
                {
                    name: 'quantity',
                    type: 'number',
                    value: quantity
                },
                {
                    name: 'imgs',
                    type: 'file',
                    value: imgs
                },
                {
                    name: 'colors',
                    type: 'checkbox',
                    value: colors
                },
                {
                    name: 'stockStatus',
                    type: 'boolean',
                    value: stockStatus
                },
                {
                    name: 'sizes',
                    type: 'checkbox',
                    value: sizes
                },


            ]

        const errors: FormError = validateForm(validateSchema)
        if (Object.keys(errors).length > 0) {
            return setFormErrors({ ...errors })
        }
        dispatch(addProduct(formData))
    }




    if (status === Status.FULFILLED && action === Action.ADD) {
        return <Navigate to="/admin/products" />
    }

    return (

        <div className='bg-white rounded-lg'>
            <div className="border-t-[1px] px-4 lg:px-8 py-6 border-b-[1px]">
                <span className='font-medium'>Add Product</span>
            </div>
            <div className='px-4 lg:px-8 py-12  max-w-[800px]'>

                <form className='grid grid-cols-1 md:grid-cols-2 gap-x-4 lg:gap-x-20 gap-y-6' onSubmit={submitHandler}>
                    <fieldset className=''>
                        <label htmlFor="title" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>title</label>
                        <input type="text" id="title" name="title" onChange={changeHandler} value={title} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                        {formErrors.title && <span className='text-red-500 text-xs'>{formErrors.title}</span>}
                    </fieldset>

                    <fieldset className=''>
                        <label htmlFor="sku" className='uppercase font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>sku</label>
                        <input type="text" id="sku" name="sku" onChange={changeHandler} value={sku} className='border-[1px] text-xs md:text-sm uppercase outline-none block px-4 py-2 rounded w-full' />
                        {formErrors.sku && <span className='text-red-500 text-xs'>{formErrors.sku}</span>}
                    </fieldset>

                    <fieldset className=''>
                        <label htmlFor="price" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>price</label>
                        <input type="number" inputMode='numeric' id="price" name="price" onChange={changeHandler} value={price ? price : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                        {formErrors.price && <span className='text-red-500 text-xs'>{formErrors.price}</span>}

                    </fieldset>

                    <fieldset className=''>
                        <span className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>images</span>
                        <label htmlFor="images" className='border-[1px] outline-none text-xs md:text-sm flex items-center gap-x-4 px-4 py-2 rounded w-full'>
                            <IoCloudUploadOutline />
                            <span className=' text-slate-500 font-emdium'>
                                Choose product images
                            </span>
                        </label>
                        {formErrors.imgs && <span className='text-red-500 text-xs'>{formErrors.imgs}</span>}



                        {/* /////////////////////////// */}
                        <input type='file' multiple id="images" name="imgs" accept="image/png, image/jpeg, image/bmp, image/webp" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full hidden' placeholder='Choose product images' onChange={changeHandler} />
                        {
                            imgPreviews.length > 0 &&
                            <div className='flex gap-x-4 gap-y-8 mt-8 flex-wrap'>
                                {
                                    imgPreviews.map((img: PrviewImage) =>
                                        <div key={v4()} className='relative'>
                                            <img className='w-14 h-14 object-cover' src={img.src} />
                                            <button onClick={(e) => previewHandler(e, img.id)} type='button' className='w-6 h-6 absolute -top-3 -right-3 bg-slate-700 rounded-full flex items-center justify-center'>
                                                <Close classN='bg-white w-1/2' />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        }
                    </fieldset>

                    <fieldset className=''>
                        <label htmlFor="slug" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>slug</label>
                        <input type="text" id="slug" name="slug" value={slug} onChange={changeHandler} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                    </fieldset>

                    <fieldset className=''>
                        <legend className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>colors</legend>
                        <div className="flex gap-4 items-center">
                            <input type="checkbox" id="black" name="colors" onChange={changeHandler} value={Colour.BLACK} className='hidden appearance-none' />
                            <label htmlFor="black" className={`w-8 h-8 rounded-full bg-black  cursor-pointer relative ${colors.indexOf(Colour.BLACK) > -1 ? 'after:content-[""] after:w-10 after:h-10 after:rounded-full after:border-2 after:border-slate-800 after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:m-auto after:-translate-x-1' : ''}  `}></label>

                            <label htmlFor="red" className={`w-8 h-8 rounded-full bg-red-600  cursor-pointer relative ${colors.indexOf(Colour.RED) > -1 ? 'after:content-[""] after:w-10 after:h-10 after:rounded-full after:border-2 after:border-red-600 after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:m-auto after:-translate-x-1' : ''}`}></label>

                            <input type="checkbox" id="red" name="colors" onChange={changeHandler} value={Colour.RED} className='appearance-none hidden ' />

                            <label htmlFor="gray" className={`w-8 h-8 rounded-full bg-gray-600  cursor-pointer relative ${colors.indexOf(Colour.GRAY) > -1 ? 'after:content-[""] after:w-10 after:h-10 after:rounded-full after:border-2 after:border-gray-600 after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:m-auto after:-translate-x-1' : ''}`}></label>

                            <input type="checkbox" id="gray" name="colors" onChange={changeHandler} value={Colour.GRAY} className='appearance-none hidden ' />

                            <label htmlFor="white" className={`w-8 h-8 rounded-full bg-regal-white  cursor-pointer relative ${colors.indexOf(Colour.WHITE) > -1 ? 'after:content-[""] after:w-10 after:h-10 after:rounded-full after:border-2 after:border-regal-white after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:m-auto after:-translate-x-1' : ''}`}></label>

                            <input type="checkbox" id="white" name="colors" onChange={changeHandler} value={Colour.WHITE} className='appearance-none hidden ' />


                            <label htmlFor="amber" className={`w-8 h-8 rounded-full bg-amber-300  cursor-pointer relative ${colors.indexOf(Colour.AMBER) > -1 ? 'after:content-[""] after:w-10 after:h-10 after:rounded-full after:border-2 after:border-amber-300 after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 after:m-auto after:-translate-x-1' : ''}`}></label>

                            <input type="checkbox" id="amber" name="colors" onChange={changeHandler} value={Colour.AMBER} className='appearance-none hidden ' />
                        </div>
                        {formErrors.colors && <span className='text-red-500 text-xs'>{formErrors.colors}</span>}

                    </fieldset>

                    <fieldset>
                        <label htmlFor="stock" className='font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Stock status</label>


                        <select name="stockStatus" id="stock" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' onChange={changeHandler}>
                            <option value="" hidden>Select stock status</option>
                            <option className='outline-none block px-4 py-2 rounded w-full' value='true'>In Stock</option>
                            <option className='outline-none block px-4 py-2 rounded w-full' value='' >Out of Stock</option>
                        </select>
                        {formErrors.stockStatus && <span className='text-red-500 text-xs'>{formErrors.stockStatus}</span>}

                    </fieldset>

                    <fieldset>
                        <legend className='font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full '>Size</legend>

                        <div className="flex gap-4">

                            <input type="checkbox" onChange={changeHandler} name="sizes" id="small" value={Size.SMALL} className='appearance-none hidden' />
                            <label htmlFor="small" className={`w-8 block flex items-center justify-center h-8 text-xs md:text-sm font-medium rounded cursor-pointer border-[1px] ${sizes.indexOf(Size.SMALL) > -1 ? 'bg-slate-200' : ''}`}>S</label>


                            <input type="checkbox" onChange={changeHandler} name="sizes" id="medium" value={Size.MEDIUM} className='appearance-none hidden' />
                            <label htmlFor="medium" className={`w-8 block flex items-center justify-center h-8 text-xs md:text-sm font-medium rounded cursor-pointer border-[1px] ${sizes.indexOf(Size.MEDIUM) > -1 ? 'bg-slate-200' : ''}`}>M</label>


                            <input type="checkbox" onChange={changeHandler} name="sizes" id="large" value={Size.LARGE} className='appearance-none hidden' />
                            <label htmlFor="large" className={`w-8 block flex items-center justify-center h-8 text-xs md:text-sm font-medium rounded cursor-pointer border-[1px] ${sizes.indexOf(Size.LARGE) > -1 ? 'bg-slate-200' : ''}`}>L</label>

                            <input type="checkbox" onChange={changeHandler} name="sizes" id="extraLarge" value={Size.EXTRA_LARGE} className='appearance-none hidden' />
                            <label htmlFor="extraLarge" className={`w-8 block flex items-center justify-center h-8 text-xs md:text-sm font-medium rounded cursor-pointer border-[1px] ${sizes.indexOf(Size.EXTRA_LARGE) > -1 ? 'bg-slate-200' : ''}`}>XL</label>
                        </div>
                        {formErrors.sizes && <span className='text-red-500 text-xs'>{formErrors.sizes}</span>}

                    </fieldset>

                    <fieldset className=''>
                        <label htmlFor="quantity" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Available quantity</label>
                        <input type="number" id="quantity" name="quantity" onChange={changeHandler} value={quantity ? quantity : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                        {formErrors.quantity && <span className='text-red-500 text-xs'>{formErrors.quantity}</span>}

                    </fieldset>


                    <fieldset className=''>
                        <label htmlFor="category" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Category</label>
                        <input type="text" id="category" name="category" onChange={changeHandler} value={category ? category : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                        {formErrors.category && <span className='text-red-500 text-xs'>{formErrors.category}</span>}

                    </fieldset>


                    <fieldset className='md:col-span-2'>
                        <label htmlFor="description" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>description</label>
                        <textarea id="description" name="description" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full max-w-full h-32' onChange={changeHandler} value={description} />
                        {formErrors.description && <span className='text-red-500 text-xs'>{formErrors.description}</span>}

                    </fieldset>

                    <fieldset className='flex items-center gap-4 md:col-span-2 text-xs md:text-sm'>
                        <input type="checkbox" name="featured" id="featured" onChange={changeHandler} className=' size:4 md:size-6 border-[1px] rounded accent-slate-600' />
                        <label htmlFor='featured' className='font-medium  text-slate-600'>Is Featured</label>
                    </fieldset>

                    <button type="submit" id='add_product' className='md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base'>Add Product</button>

                </form>
            </div>
        </div>

    )
}

export default AddProduct