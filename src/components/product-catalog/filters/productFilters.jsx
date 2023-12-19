export const sortOptions = [
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]

export const subCategories = [
    { name: 'T-Shirts', href: '#' },
    { name: 'Shirts', href: '#' },
    { name: 'Hoodies', href: '#' },
    { name: 'Accessories', href: '#' },
]

export const filters = [
    {
        id: 'price',
        type: 'radio',
        name: 'Price',
        options: [
            { value: 'LowToHigh', label: 'Low to High', checked: false },
            { value: 'HighToLow', label: 'High to Low', checked: false },
        ],
    },
    {
        id: 'color',
        name: 'Color',
        options: [
            { value: 'white', label: 'White', checked: false },
            { value: 'beige', label: 'Beige', checked: false },
            { value: 'blue', label: 'Blue', checked: false },
            { value: 'brown', label: 'Brown', checked: false },
            { value: 'green', label: 'Green', checked: false },
            { value: 'purple', label: 'Purple', checked: false },
            { value: 'red', label: 'Red', checked: false },
            { value: 'yellow', label: 'Yellow', checked: false },
            { value: 'grey', label: 'Grey', checked: false },
            { value: 'black', label: 'Black', checked: false },
            { value: 'lightPink', label: 'Light Pink', checked: false },
            { value: 'lightGreige', label: 'Light Greige', checked: false },
            { value: 'lightGreyMarl', label: 'Light Grey Marl', checked: false },
            { value: 'darkGreen', label: 'Dark Green', checked: false },
            { value: 'lightBeige', label: 'Light Beige', checked: false },
            { value: 'lightDarkBrown', label: 'Light Dark Brown', checked: false },
        ],

    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'new-arrivals', label: 'New Arrivals', checked: false },
            { value: 'sale', label: 'Sale', checked: false },
            { value: 'travel', label: 'Travel', checked: false },
            { value: 'organization', label: 'Organization', checked: false },
            { value: 'accessories', label: 'Accessories', checked: false },
        ],
    },
    {
        id: 'size',
        name: 'Size',
        options: [
            { value: 'XS', label: 'XS', checked: false },
            { value: 'Small', label: 'Small', checked: false },
            { value: 'Medium', label: 'Medium', checked: false },
            { value: 'Large', label: 'Large', checked: false },
            { value: 'XL', label: 'XL', checked: false },
            { value: 'XXL', label: 'XXL', checked: false },
        ],
    },
]