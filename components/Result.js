import React from 'react';
import { StyleSheet, Button, View, Text} from 'react-native';

export default class Result extends React.Component {
    constructor(){
        super();

        this.state = {
            inBag: '',
        }

        this.amountOfCoin = this.amountOfCoin.bind(this);
        this.amountInRegister = this.amountInRegister.bind(this);
        this.createInRegister = this.createInRegister.bind(this);
        this.createInBag = this.createInBag.bind(this);
    }

    amountOfCoin() {
        //this coins object splits the coins up into multiples of 5 or 10, with any excess being stored to the side
        let coins = {toonies: {total: 0, excess: 0}, loonies: {total: 0, excess: 0}, quarters: {total: 0, excess: 0}, dimes: {total: 0, excess: 0}, nickels: {total: 0, excess: 0}, total: 0, excess: 0};
        let cashArr = this.props.cashArr;

        //counting toonies
        if(cashArr.Toonies%5 === 0){
            coins.toonies.total = cashArr.Toonies;
            coins.total += coins.toonies.total*2;
        } else {
            if(cashArr.Toonies > 5){
                console.log(cashArr.Toonies - ((cashArr.Toonies/5)*10 - Math.trunc(cashArr.Toonies/5)*10)/2);
                coins.toonies.total = cashArr.Toonies - ((cashArr.Toonies/5)*10 - Math.trunc(cashArr.Toonies/5)*10)/2;
                coins.total += coins.toonies.total*2;
                coins.toonies.excess = Math.round(((cashArr.Toonies/10) - Math.floor(cashArr.Toonies/10))*10);
                coins.excess += coins.toonies.excess*2;
            } else {
                coins.toonies.excess = cashArr.Toonies;
                coins.excess += coins.toonies.excess*2;
            }
        }

        //counting loonies
        if(cashArr.Loonies%5 === 0){
            coins.loonies.total = cashArr.Loonies;
        } else {
            if(cashArr.Loonies > 5){
                coins.loonies.total = Math.trunc(cashArr.Loonies/5)*5;
                coins.total += coins.loonies.total;
                coins.loonies.excess = Math.round(((cashArr.Loonies/5) - Math.floor(cashArr.Loonies/5))*5);
                coins.excess += coins.loonies.excess;
            } else {
                coins.loonies.excess = cashArr.Loonies;
                coins.excess += coins.loonies.excess;
            }
        }

        //counting quarters
        if(cashArr.Quarters%20 === 0){
            coins.quarters.total = cashArr.Quarters;
        } else {
            if(cashArr.Quarters > 20){
                coins.quarters.total = Math.trunc(cashArr.Quarters/20)*20;
                coins.total += coins.quarters.total*0.25;
                //coins.quarters.excess = Math.round(((cashArr.Quarters/10) - Math.floor(cashArr.Quarters/10))*10);
                coins.quarters.excess = cashArr.Quarters - coins.quarters.total;
                coins.excess += coins.quarters.excess*0.25;
            } else {
                coins.quarters.excess = cashArr.Quarters;
                coins.excess += coins.quarters.excess*0.25;
            }
        }

        //counting dimes
        if(cashArr.Dimes%50 === 0){
            coins.dimes.total = cashArr.Dimes;
        } else {
            if(cashArr.Dimes > 50){
                coins.dimes.total = Math.trunc(cashArr.Dimes/50)*50;
                coins.total += coins.dimes.total*0.1;
                coins.dimes.excess = Math.round(((cashArr.Dimes/50) - Math.floor(cashArr.Dimes/50))*50);
                coins.excess += coins.dimes.excess;
            } else {
                coins.dimes.excess = cashArr.Dimes;
                coins.excess += coins.dimes.excess*0.1;
            }
        }

        //counting nickels
        if(cashArr.Nickels%100 === 0){
            coins.nickels.total = cashArr.Nickels;
        } else {
            if(cashArr.Nickels > 100){
                coins.nickels.total = Math.trunc(cashArr.Nickels/100)*100;
                coins.total += coins.nickels.total*0.05;
                coins.nickels.excess = Math.round(((cashArr.Nickels/100) - Math.floor(cashArr.Nickels/100))*100);
                coins.excess += coins.nickels.excess;
            } else {
                coins.nickels.excess = cashArr.Nickels;
                coins.excess += coins.nickels.excess*0.05;
            }
        }

        return coins;
    }

    amountInRegister(){
        //this bills object will count the amount of bills that actually go into the register (total) and what doesn't go into the register (excess)
        let bills = {five: {total: 0, excess: 0}, ten: {total: 0, excess: 0}, twenty: {total: 0, excess: 0}, fifty: {total: 0, excess: 0}, hundred: {total: 0, excess: 0}, excess: 0};
        let cashArr = this.props.cashArr;
        let coinRes = this.amountOfCoin();
        let registerTotal = 150 - coinRes.total;

        if(coinRes.total < 150){
            console.log('there are not enough coins in the register!')
            if(coinRes.total%10 === 0){//total of coin is divisible by 10, take an even amount of 5s
                bills.five.total = (cashArr.FiveDollar*5)%10 === 0 ? cashArr.FiveDollar : cashArr.FiveDollar-1;
                registerTotal -= bills.five.total*5;
                bills.five.excess = 1;
                bills.excess += bills.five.excess*5;
            } else if(coinRes.total%10 !== 0){//total of coin is divisible by 5 and not 10, take an odd amount of 5s
                if(cashArr.FiveDollar%2 === 0){
                    bills.five.total = cashArr.FiveDollar-1;
                    registerTotal -= bills.five.total*5;
                    bills.five.excess = 1;
                    bills.excess += bills.five.excess*5;
                } else {
                    bills.five.total = cashArr.FiveDollar;
                    registerTotal -= bills.five.total*5;
                    bills.five.excess = 0;
                }
            }

            if(registerTotal > 0) {//if remainder in register is over 0 subtract 10s
                if(registerTotal%20 === 0) {//if remaining value is divisible by 20, subtract even amount of 10s
                    if(cashArr.TenDollar%2 === 0) {//check for even amount of 10s
                        bills.ten.total = cashArr.TenDollar*10 <= registerTotal ? cashArr.TenDollar : (registerTotal/10);
                        registerTotal -= bills.ten.total*10;
                        bills.ten.excess = cashArr.TenDollar - bills.ten.total;
                        bills.excess += bills.ten.excess;
                    } else {//check for odd amount of 10s
                        bills.ten.total = (cashArr.TenDollar-1)*10 <= registerTotal ? cashArr.TenDollar : (registerTotal/10)
                        registerTotal -= bills.ten.total*10;
                        bills.ten.excess = cashArr.TenDollar - bills.ten.total;
                        bills.excess += bills.ten.excess*10;
                    }
                } else {//remaining value not divisible by 20
                    if(cashArr.TenDollar%2 !== 0){//check for odd amount of 10s
                        bills.ten.total = (cashArr.TenDollar-1)*10 <= registerTotal ? cashArr.TenDollar : (registerTotal/10)
                        registerTotal -= bills.ten.total*10;
                        bills.ten.excess = cashArr.TenDollar - bills.ten.total;
                        bills.excess += bills.ten.excess;
                    } else {//check for even amount of 10s
                        bills.ten.total = cashArr.TenDollar*10 <= registerTotal ? cashArr.TenDollar : (registerTotal/10);
                        registerTotal -= bills.ten.total*10;
                        bills.ten.excess = cashArr.TenDollar - bills.ten.total;
                        bills.excess += bills.ten.excess*10;
                    }
                } 

                if(registerTotal%20 === 0 && registerTotal > 0) {
                    if(cashArr.TwentyDollar >= registerTotal/20){//if there are enough 20s
                        bills.twenty.total = registerTotal/20;
                        registerTotal -= bills.twenty.total*20;
                        bills.twenty.excess = cashArr.TwentyDollar - bills.twenty.total;
                        bills.excess += bills.twenty.excess*20;
                    } else {//if there aren't enough 20s
                        bills.twenty.total = cashArr.TwentyDollar;
                        registerTotal -= bills.twenty.total*20;
                        bills.twenty.excess = 0;
                    }
                } else {
                    bills.twenty.excess = cashArr.TwentyDollar;
                    bills.excess += bills.twenty.excess*20;
                }

                if(registerTotal%50 === 0 && registerTotal > 0){
                    if(cashArr.FiftyDollar >= registerTotal/50){//if there are enough 50s
                        bills.fifty.total = registerTotal/50;
                        registerTotal -= bills.fifty.total;
                        bills.fifty.excess = cashArr.FiftyDollar - bills.fifty.total;
                        bills.excess += bills.fifty.excess*50;
                    } else {//if there aren't enough 50s
                        bills.fifty.total = cashArr.FiftyDollar;
                        registerTotal -= bills.fifty.total;
                        bills.fifty.excess = 0;
                    }
                } else {
                    bills.fifty.excess = cashArr.FiftyDollar;
                    bills.excess += bills.fifty.excess*50;
                }
                
                if(registerTotal%100 === 0 && registerTotal > 0){
                    if(cashArr.HundredDollar >= registerTotal/100){//if there are enough 100s
                        bills.hundred.total = registerTotal/100;
                        registerTotal -= bills.hundred.total;
                        bills.hundred.excess = cashArr.HundredDollar - bills.hundred.total;
                        bills.excess = bills.hundred.excess*100;
                    } else {//if there aren't enough 100s
                        bills.hundred.total = cashArr.HundredDollar;
                        registerTotal -= bills.hundred.total;
                        bills.hundred.excess = 0;
                    }
                } else {
                    bills.hundred.excess = cashArr.HundredDollar;
                    bills.excess += bills.hundred.excess*100;
                }

                console.log('-----------------------------------------------------\n-----------------------------------------------------')
                console.log(`Total coins: ${coinRes.total}`)
                console.log(`Excess coins: ${coinRes.excess}`)
                console.log('-----------------------------------------------------\n-----------------------------------------------------')
                console.log(`Excess bills: ${bills.excess}`)
                console.log('-----------------------------------------------------\n-----------------------------------------------------')
                console.log(`and by this point, register total should be: ${registerTotal}`)
                console.log('-----------------------------------------------------\n-----------------------------------------------------')
            }
        } else {
            console.log(`Total coins: ${coinRes.total}`)
            console.log('there are enough coins to fill the register!')
        }  

        return bills;
    }

    createInRegister() {
        let coins = this.amountOfCoin();
        let bills = Object.assign(this.amountInRegister(), coins);

        delete bills.total;
        delete bills.excess;

        let amounts = {nickel: 0.05, dime: 0.1, quarter: 0.25, loonies: 1, toonies: 2, five: 5, ten: 10, twenty: 20, fifty: 50, hundred: 100};

        let temp = Object.keys(bills).map((key,idx) => bills[key].excess*amounts[key]);
        total = temp.reduce((acc,curr) => !isNaN(curr) ? acc+curr : acc+0);

        console.log(`Total in register is: ${total}`);

        let stateCurrency = ['nickels', 'dimes', 'quarters', 'loonies', 'toonies', 'five', 'ten', 'twenty', 'fifty', 'hundred'];
        let currency = ['Nickels', 'Dimes', 'Quarters', 'Loonies', 'Toonies', 'Five', 'Ten', 'Twenty', 'Fifty', 'Hundred'];

        let inRegister = new Array(10).fill().map((bag, idx) => <View style={{flexDirection: 'row'}} key={idx}>
                                                               <Text>{currency[idx]}: </Text><Text>{bills[stateCurrency[idx]].excess}</Text> 
                                                           </View>)

        inRegister.push(<View style={{flexDirection: 'row'}} key={11}>
                    <Text>Total: </Text><Text>{total}</Text> 
                    </View>)
        return inRegister;
    }

    createInBag() {
        let coins = this.amountOfCoin();
        let bills = Object.assign(this.amountInRegister(), coins);

        delete bills.total;
        delete bills.excess;

        let amounts = {nickel: 0.05, dime: 0.1, quarter: 0.25, loonies: 1, toonies: 2, five: 5, ten: 10, twenty: 20, fifty: 50, hundred: 100};

        let temp = Object.keys(bills).map((key,idx) => bills[key].total*amounts[key]);
        total = temp.reduce((acc,curr) => !isNaN(curr) ? acc+curr : acc+0);

        console.log(`Total in bag is: ${total}`);

        let stateCurrency = ['nickels', 'dimes', 'quarters', 'loonies', 'toonies', 'five', 'ten', 'twenty', 'fifty', 'hundred'];
        let currency = ['Nickels', 'Dimes', 'Quarters', 'Loonies', 'Toonies', 'Five', 'Ten', 'Twenty', 'Fifty', 'Hundred'];

        let inBag = new Array(10).fill().map((bag, idx) => <View style={{flexDirection: 'row'}} key={idx}>
                                                               <Text>{currency[idx]}: </Text><Text>{bills[stateCurrency[idx]].total}</Text> 
                                                           </View>)

        inBag.push(<View style={{flexDirection: 'row'}} key={11}>
                    <Text>Total: </Text><Text>{total}</Text> 
                    </View>)

        return inBag;
    }

    render() {
        let inRegister = this.createInRegister();
        let inBag = this.createInBag();

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: 15}}>
                        <Text style={{fontSize: 20, marginBottom: 10}}>In Bag</Text>
                        {inRegister}
                    </View>
                    <View style={{borderRightWidth: 2, borderColor: 'black'}}></View>
                    <View style={{marginLeft: 15}}>
                        <Text style={{fontSize: 20, marginBottom: 10}}>In Register</Text>
                        {inBag}
                    </View>
                </View>
                <View style={styles.button}>
                    <Button 
                        onPress={this.props.return} 
                        title='Return'
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      marginTop: 15,
      width: 175
    }
});