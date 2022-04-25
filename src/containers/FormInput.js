export default function FormInput(props) {
    return (
        <div>
            <label for={props.name} class="sr-only">{props.name}</label>
            <input 
                id={props.name} 
                name={props.name} 
                type="text" 
                required 
                placeholder={props.placeholder !== "" && props.placeholder}
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
            />
        </div>
    )
}