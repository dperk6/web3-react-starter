import React from "react";
import { web3 } from "../utils/base";
import { Networks } from "../utils/networks";

const usePrice = (address: string) => {
    const [priceUsd, setPriceUsd] = React.useState<number>(0.00);
    const [status, setStatus] = React.useState<'standby' | 'succeeded' | 'failed' | 'pending'>('standby');

    const getPrice = React.useCallback(async () => {
        setStatus('pending');
        const chainId: number = await web3.eth.getChainId();
        if (Networks[Number(chainId)] !== undefined) {
            const url: string = `https://api.coingecko.com/api/v3/coins/${JSON.parse(Networks[Number(chainId)]).name.toLowerCase()}/contract/${address}`;
            const { priceUsd, logo } = await fetch(url)
                .then((res: any) => res.json()).then((json: any) => {
                    setPriceUsd(json.market_data.current_price.usd ?? 0);
                    return {
                        priceUsd: json.market_data.current_price.usd ?? 0,
                        logo: json.image.small
                    }
            }).catch((e: any) => {
                console.log(e);
                setPriceUsd(0);
                return {
                    priceUsd: 0,
                    logo: ''
                }
            });

            return { priceUsd, logo };
        }
    }, [address]);

    React.useEffect(() => {
        Promise.resolve(getPrice().then(
            (res: any) => {
                setPriceUsd(res.priceUsd);
                setStatus('succeeded');
            }).catch(() => {
                setPriceUsd(0);
                setStatus('failed');
            }));
            
    }, [getPrice]);

    return { priceUsd, status };
}

export default usePrice;