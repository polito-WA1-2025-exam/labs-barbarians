function OrderSummaryEntry(props) {
    const bowl = props.bowl;
    const quantity = props.quantity;

    // Ensure proteins is always an array
    const proteins = (() => {
        try {
            const parsed = JSON.parse(bowl.proteins || "[]");
            return Array.isArray(parsed) ? parsed : [parsed]; // Ensure it's an array
        } catch {
            return Array.isArray(bowl.proteins) ? bowl.proteins : [bowl.proteins]; // Fallback
        }
    })();

    // Ensure ingredients is always an array
    const ingredients = (() => {
        try {
            const parsed = JSON.parse(bowl.ingredients || "[]");
            return Array.isArray(parsed) ? parsed : [parsed]; // Ensure it's an array
        } catch {
            return Array.isArray(bowl.ingredients) ? bowl.ingredients : [bowl.ingredients]; // Fallback
        }
    })();

    return (
        <tr>
            <td>{bowl.size || 'N/A'}</td>
            <td>{bowl.base || 'N/A'}</td>
            <td>{proteins.join(", ") || 'N/A'}</td>
            <td>{ingredients.join(", ") || 'N/A'}</td>
            <td>{quantity || 0}</td>
        </tr>
    );
}

export default OrderSummaryEntry;