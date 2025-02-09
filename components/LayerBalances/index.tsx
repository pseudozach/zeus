import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager } from 'react-native';

import { FlatList, RectButton } from 'react-native-gesture-handler';

import OnchainSwipeableRow from './OnchainSwipeableRow';
import LightningSwipeableRow from './LightningSwipeableRow';

import BalanceStore from './../../stores/BalanceStore';
import UnitsStore from './../../stores/UnitsStore';

import { themeColor } from './../../utils/ThemeUtils';

import { inject, observer } from 'mobx-react';

import OnChain from './../../images/SVG/OnChain.svg';
import Lightning from './../../images/SVG/Lightning Circle.svg';
import { Amount } from '../Amount';
import { Spacer } from '../layout/Spacer';

import * as Animatable from 'react-native-animatable';

interface LayerBalancesProps {
    BalanceStore: BalanceStore;
    UnitsStore: UnitsStore;
    navigation: any;
}

//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

type DataRow = {
    layer: string;
    balance: string | number;
};

const Row = ({ item }: { item: DataRow }) => (
    <RectButton
        style={{
            ...styles.rectButton,
            backgroundColor: themeColor('secondary')
        }}
    >
        <View style={styles.left}>
            {item.layer === 'On-chain' ? <OnChain /> : <Lightning />}
            <Spacer width={5} />
            <Text style={{ ...styles.layerText, color: themeColor('text') }}>
                {item.layer}
            </Text>
        </View>

        <Amount sats={item.balance} sensitive />
    </RectButton>
);

const SwipeableRow = ({
    item,
    index,
    navigation
}: {
    item: DataRow;
    index: number;
    navigation: any;
}) => {
    if (index === 1) {
        return (
            <OnchainSwipeableRow navigation={navigation}>
                <Row item={item} />
            </OnchainSwipeableRow>
        );
    }

    return (
        <LightningSwipeableRow navigation={navigation}>
            <Row item={item} />
        </LightningSwipeableRow>
    );
};

@inject()
@observer
export default class LayerBalances extends Component<LayerBalancesProps, {}> {
    render() {
        const { BalanceStore, navigation } = this.props;

        const { totalBlockchainBalance, lightningBalance } = BalanceStore;

        const DATA: DataRow[] = [
            {
                layer: 'Lightning',
                balance: lightningBalance
            },
            {
                layer: 'On-chain',
                balance: totalBlockchainBalance
            }
        ];

        return (
            <FlatList
                data={DATA}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item, index }) => (
                    <Animatable.View
                        animation="slideInRight"
                        useNativeDriver={true}
                    >
                        <SwipeableRow
                            item={item}
                            index={index}
                            navigation={navigation}
                        />
                    </Animatable.View>
                )}
                keyExtractor={(_item, index) => `message ${index}`}
                style={{ top: 20 }}
            />
        );
    }
}

const styles = StyleSheet.create({
    rectButton: {
        height: 80,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 15
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    separator: {
        backgroundColor: 'transparent',
        height: 20
    },
    layerText: {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        fontSize: 15
    }
});
