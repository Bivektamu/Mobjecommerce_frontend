import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { Colour, Size, ValidateSchema, FormError, Status, Action, ProductEditInput, ProductImageInput, ProductImage } from '../../store/types'
import validateForm from '../../utils/validate';
import Close from '../ui/Close';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { editProduct, getProducts, useProduct } from '../../store/slices/productSlice';
import { useStoreDispatch } from '../../store';
import mongoose from 'mongoose';
import ProgressLoader from '../ui/ProgressLoader';


interface PreviewImage {
    id: mongoose.Types.ObjectId,
    src: string
}

const EditProduct = () => {

    const dispatch = useStoreDispatch()

    const navigate = useNavigate()

    const params = useParams()
    const { products, status, action } = useProduct()


    const [formData, setFormData] = useState<ProductEditInput>({} as ProductEditInput)


    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getProducts())
    }, [])


    useEffect(() => {

        if (products.length > 0) {

            const product = products?.filter(pro => pro.slug === params.slug)
            if (product.length < 1) {
                navigate('/404')
            }



            let tempProduct: ProductEditInput = {} as ProductEditInput

            const { imgs, ...rest } = product[0]

            tempProduct = { ...rest, newImgs: [], oldImgs: imgs, }

            // console.log(tempProduct);

            setFormData(tempProduct as ProductEditInput)
        }
    }, [products, params.slug])



    const [formErrors, setFormErrors] = useState<FormError>({})
    const [imgPreviews, setImagePreviews] = useState<PreviewImage[]>([])

    const { title, sku, price, oldImgs, newImgs, slug, colors, stockStatus, sizes, quantity, description, category, featured } = formData

    useEffect(() => {
        if (newImgs?.length > 0) {

            const previews: PreviewImage[] = []
            newImgs.map(img => {

                const reader = new FileReader()
                reader.onload = () => {
                    if (reader.result) {
                        const previewImg: PreviewImage = {
                            id: img._id,
                            src: reader.result as string
                        }
                        previews.push(previewImg);
                        if (previews.length === newImgs.length) {
                            setImagePreviews([...previews])
                        }
                    }
                }
                reader.readAsDataURL(img.img)
            })
        }

        else {
            setImagePreviews([])
        }

    }, [newImgs])


    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            Object.keys(formData).map(key => {
                if (formData[key as keyof ProductEditInput]) {
                    setFormErrors(prev => ({ ...prev, [key]: '' }))
                }

            })
        }
    }, [formData])

    // /////////////////////////////////

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.stopPropagation()


        let val: string | string[] | ProductImageInput[] | boolean | number

        if (e.target.type === 'file') {

            const event = e.target as HTMLInputElement
            const files: FileList = event.files as FileList
            val = [...newImgs] as ProductImageInput[]
            for (let i = 0; i < files!.length; i++) {
                const file: ProductImageInput = {
                    img: files![i],
                    _id: new mongoose.Types.ObjectId()
                }
                val.push(file)
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
        else if (e.target.name === 'stockStatus') {
            if (e.target.value === 'true') {
                val = true
            }
            else {
                val = false
            }

        }
        else {
            val = e.target.value
            if (parseInt(val)) {
                val = parseInt(val)
            }
        }

        if (e.target.name === 'category') {
            val = e.target.value.toLowerCase()
        }

        const updateData = {
            [e.target.name]: val
        }

        if (e.target.name === 'title') {
            let newSlug: string = val as string
            newSlug = newSlug.replaceAll(' ', '-')
            updateData.slug = newSlug.toLowerCase()
        }

        setFormData(prev => ({
            ...prev,
            ...updateData
        }))
    }


    const previewHandler = (e: MouseEvent<HTMLButtonElement>, id: mongoose.Types.ObjectId) => {
        e.preventDefault()
        e.stopPropagation()
        const updateImgs = [...newImgs]
        const index = updateImgs.findIndex(img => img._id === id)
        updateImgs.splice(index, 1)
        setFormData(prev => ({ ...prev, newImgs: [...updateImgs] }))
    }

    const deleteHandlerForOldImgs = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault()
        e.stopPropagation()

        setFormData(prev => ({ ...prev, oldImgs: [...oldImgs.filter(img => img.id !== id)] }))
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
                    name: 'slug',
                    type: 'text',
                    value: slug
                },
                {
                    name: 'description',
                    type: 'text',
                    value: description
                },
                {
                    name: 'category',
                    type: 'text',
                    value: category
                },
                {
                    name: 'sku',
                    type: 'aplhaNumeric',
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
                    value: [...oldImgs, ...newImgs]
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
            setFormErrors({ ...errors })
        }
        else {

            dispatch(editProduct(formData))
        }


    }


    if (Object.keys(formData).length < 1 || status === Status.PENDING) {
        return <ProgressLoader />
    }

    if (status === Status.FULFILLED && action === Action.EDIT) {
        return <Navigate to="/admin/products" />
    }


    return (

        <div className='bg-white rounded-lg'>
            <div className="border-t-[1px] px-4 lg:px-8 py-6 border-b-[1px]">
                <span className='font-medium'>Edit Product</span>
            </div>
            <div className=' px-4 lg:px-8 py-12  max-w-[800px]'>

                <form className='grid grid-cols-1 md:grid-cols-2 gap-x-4 lg:gap-x-20 gap-y-6' onSubmit={submitHandler}>
                    <div className='grid grid-cols-1 w-full gap-6'>
                        <fieldset className=''>
                            <label htmlFor="title" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>title</label>
                            <input type="text" id="title" name="title" onChange={changeHandler} value={title} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                            {formErrors.title && <span className='text-red-500 text-xs'>{formErrors.title}</span>}
                        </fieldset>
                        <fieldset className=''>
                            <label htmlFor="price" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>price</label>
                            <input type="number" inputMode='numeric' id="price" name="price" onChange={changeHandler} value={price ? price : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                            {formErrors.price && <span className='text-red-500 text-xs'>{formErrors.price}</span>}

                        </fieldset>

                        <fieldset className=''>
                            <label htmlFor="slug" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>slug</label>
                            <input type="text" id="slug" name="slug" value={slug} onChange={changeHandler} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                            {formErrors.slug && <span className='text-red-500 text-xs'>{formErrors.slug}</span>}

                        </fieldset>

                        <fieldset>
                            <label htmlFor="stock" className='font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Stock status</label>


                            <select value={stockStatus ? 'true' : 'false'} name="stockStatus" id="stock" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' onChange={changeHandler}>
                                <option value="" hidden>Select stock status</option>
                                <option className='outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' value='true'>In Stock</option>
                                <option value='false' className='outline-none text-xs md:text-sm block px-4 py-2 rounded w-full'>Out of Stock</option>
                            </select>
                            {formErrors.stockStatus && <span className='text-red-500 text-xs'>{formErrors.stockStatus}</span>}

                        </fieldset>

                        <fieldset className=''>
                            <label htmlFor="quantity" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Available quantity</label>
                            <input type="number" id="quantity" name="quantity" onChange={changeHandler} value={quantity ? quantity : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                            {formErrors.quantity && <span className='text-red-500 text-xs'>{formErrors.quantity}</span>}

                        </fieldset>

                        <fieldset className='flex items-center gap-4 pt-4'>
                            {featured ? <input type="checkbox" checked name="featured" id="featured" onChange={changeHandler} className=' w-6 h-6 border-[1px] rounded accent-slate-600' /> : <input type="checkbox" name="featured" id="featured" onChange={changeHandler} className=' w-6 h-6 border-[1px] rounded accent-slate-600' />}


                            <label htmlFor='featured' className='font-medium  text-slate-600'>Is Featured</label>
                        </fieldset>
                    </div>

                    <div className='grid grid-cols-1 w-full gap-6'>
                        <fieldset className=''>
                            <label htmlFor="sku" className='uppercase font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>sku</label>
                            <input type="text" id="sku" name="sku" onChange={changeHandler} value={sku.toUpperCase()} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full' />
                            {formErrors.sku && <span className='text-red-500 text-xs'>{formErrors.sku}</span>}

                        </fieldset>
                        <fieldset className={imgPreviews.length > 0 ? 'row-span-2' : ''}>
                            <span className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>images</span>
                            <label htmlFor="images" className='border-[1px] outline-none text-xs md:text-sm flex items-center gap-x-4 px-4 py-2 rounded w-full'>
                                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.80769 16.2857H2.41209C2.09441 16.2857 1.78975 16.1595 1.56511 15.9349C1.34048 15.7103 1.21429 15.4056 1.21429 15.0879V5.5055M1.21429 5.5055H16.7857M1.21429 5.5055L3.86143 1.31318C3.96387 1.13559 4.11017 0.987268 4.28634 0.882406C4.46251 0.777545 4.66264 0.719655 4.86758 0.714279H13.1324C13.3374 0.719655 13.5375 0.777545 13.7137 0.882406C13.8898 0.987268 14.0362 1.13559 14.1386 1.31318L16.7857 5.5055M16.7857 5.5055V15.0879C16.7857 15.4056 16.6595 15.7103 16.4349 15.9349C16.2103 16.1595 15.9056 16.2857 15.5879 16.2857H13.1923M6.00545 12.0934L8.99996 9.09889M8.99996 9.09889L11.9945 12.0934M8.99996 9.09889L9.00004 16.2857M9.00004 0.714279V5.50549" stroke="#5C5F6A" strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className=' text-slate-500 font-emdium'>
                                    Choose product images
                                </span>
                            </label>
                            {formErrors.imgs && <span className='text-red-500 text-xs'>{formErrors.imgs}</span>}



                            {/* /////////////////////////// */}
                            <input type='file' multiple id="images" name="newImgs" accept="image/png, image/jpeg, image/bmp, image/webp" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full hidden' placeholder='Choose product images' onChange={changeHandler} />

                            {
                                (oldImgs.length > 0 || imgPreviews.length > 0) &&
                                <div className='flex gap-x-4 gap-y-8 mt-8 flex-wrap'>

                                    {
                                        oldImgs.length > 0 &&

                                        oldImgs.filter(img => img.url).map((img: ProductImage) =>
                                            <div key={img.id} className='relative'>
                                                <img className='w-14 h-14 object-cover' src={img.url} />
                                                <button onClick={(e) => deleteHandlerForOldImgs(e, img.id)} type='button' className='w-6 h-6 absolute -top-3 -right-3 bg-slate-600 rounded-full flex items-center justify-center'>
                                                    <Close classN='w-1/2 bg-white' />
                                                </button>
                                            </div>
                                        )
                                    }

                                    {
                                        imgPreviews.map((img: PreviewImage) =>
                                            <div key={img.id as unknown as string} className='relative'>
                                                <img className='w-14 h-14 object-cover' src={img.src} />
                                                <button onClick={(e) => previewHandler(e, img.id)} type='button' className='w-6 h-6 absolute -top-3 -right-3 bg-slate-600 rounded-full flex items-center justify-center'>
                                                    <Close classN='w-1/2 bg-white' />
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            }

                        </fieldset>

                        <fieldset>
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
                            <label htmlFor="category" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Category</label>
                            <input type="text" id="category" name="category" onChange={changeHandler} value={category ? category : ''} className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full capitalize' />
                            {formErrors.category && <span className='text-red-500 text-xs'>{formErrors.category}</span>}
                        </fieldset>

                    </div>

                    <fieldset className='grid md:col-span-2'>
                        <label htmlFor="description" className='capitalize font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>description</label>
                        <textarea id="description" name="description" className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full max-w-full h-52' onChange={changeHandler} value={description} />
                        {formErrors.description && <span className='text-red-500 text-xs'>{formErrors.description}</span>}
                    </fieldset>

                        <button type="submit" className='md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base'>Edit Product</button>

                </form>
            </div>
        </div>

    )
}

export default EditProduct