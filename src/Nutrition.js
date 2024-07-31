export const Nutrition = ({ label, quantity, unit }) => {
    const formattedQuantity = quantity.toFixed(2);

    return (
        <div>
            <p className="itemNutrition"><b>{label}</b> - {formattedQuantity} {unit}</p>
        </div>
    )
}