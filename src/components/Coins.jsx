import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from "../index";
import { Container, HStack, VStack, Image, Heading, Text, Button, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from './Loader';
import Error from './Error';
import { Link } from 'react-router-dom';


const Coins = () => {

    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [currency, setCurrency] = useState("inr");
    const curr_symbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
                setCoins(data);
                console.log(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchCoins();
    }, [currency, page]);

    const changePage = (page) => {
        setPage(page);
        setLoading(true);
    }

    const btns = new Array(132).fill(1);

    if (error) {
        return <Error message={"Error while Fetching Coins!"} />;
    }

    return (<Container maxW={"container.xl"}>
        {loading ? (<Loader />) : (
            <>
                <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                    <HStack spacing={"4"}>
                        <Radio value='inr'>₹</Radio>
                        <Radio value='usd'>$</Radio>
                        <Radio value='eur'>€</Radio>
                    </HStack>
                </RadioGroup>
                <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
                    {
                        coins.map(coin => (
                            <CoinCard key={coin.id} id={coin.id} name={coin.name} img={coin.image} symbol={coin.symbol} price={coin.current_price} curr_sym={curr_symbol} />
                        ))
                    }
                </HStack>

                <HStack w={"full"} overflowX={"auto"} p={"8"}>
                    {
                        btns.map((items, index) => (
                            <Button bgColor={"blackAlpha.900"} color={"white"} onClick={() => changePage(index + 1)}>
                                {index + 1}
                            </Button>
                        ))
                    }
                </HStack>
            </>
        )}
    </Container>
    );
};

const CoinCard = ({ id, name, img, symbol, price, curr_sym }) => (
    <Link to={`/coin/${id}`} textDecor={"none"}>
        <VStack w={"52"} shadow={"lg"} p={"8"} borderRadius={"lg"} transition={"all 0.3s"} m={"4"}
            css={{
                "&:hover": {
                    transform: "scale(1.1)",
                }
            }}>``
            <Image src={img} w={"10"} h={"10"} objectFit={"contain"} alt='Exchange' />
            <Heading size={"md"} noOfLines={1}>
                {symbol}
            </Heading>
            <Text noOfLines={1}>{name}</Text>
            <Text noOfLines={1}>{price ? `${curr_sym}${price}` : "NA"}</Text>
        </VStack>
    </Link>
);

export default Coins;