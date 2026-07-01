

export const convertTemp = (temp:number,units:'metric'|'standard'|'imperial') =>{
  
        switch (units){
            case "metric":
                return Number((temp-273.15).toFixed(2))
            case "imperial":
                return Number(((temp-273.15)*9/5 +32).toFixed(2))
            default:
                return temp
        }
    }