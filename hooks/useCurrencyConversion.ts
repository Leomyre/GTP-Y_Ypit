import { useEffect, useState } from "react";

export function useCurrencyConversion(
  amount: number,
  fromCurrency: string,
  toCurrency: string
) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convert = async () => {
      if (!amount || isNaN(amount)) return;

      try {
        const response = await fetch(
          `https://api.getgeoapi.com/v2/currency/convert?api_key=283b7ea585e1b0fb3b38d97cde52ea029f474e03&from=${fromCurrency}&to=${toCurrency}&amount=${amount}&format=json`
        );
        const data = await response.json();

        if (data.status === "success") {
          const rate = parseFloat(data.rates[toCurrency].rate);
          const converted = rate * amount;

          setRate(rate);
          setConvertedAmount(converted);
        }
      } catch (error) {
        console.error("Error converting currency", error);
      } finally {
        setLoading(false);
      }
    };

    convert();
  }, [amount, fromCurrency, toCurrency]);

  return { convertedAmount, rate, loading };
}
