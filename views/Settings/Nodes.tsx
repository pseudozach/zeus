import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, Button, ListItem } from 'react-native-elements';
import SettingsStore from './../../stores/SettingsStore';
import Identicon from 'identicon.js';
const hash = require('object-hash');
import PrivacyUtils from './../../utils/PrivacyUtils';
import { localeString } from './../../utils/LocaleUtils';
import { themeColor } from './../../utils/ThemeUtils';

interface NodesProps {
    nodes: any[];
    navigation: any;
    edit?: boolean;
    loading?: boolean;
    selectedNode?: number;
    SettingsStore: SettingsStore;
}

export default class Nodes extends React.Component<NodesProps, {}> {
    renderSeparator = () => (
        <View
            style={{
                height: 1,
                width: '86%',
                backgroundColor: themeColor('separator'),
                marginLeft: '14%'
            }}
        />
    );

    render() {
        const {
            navigation,
            nodes,
            loading,
            selectedNode,
            SettingsStore
        } = this.props;
        const { setSettings, settings }: any = SettingsStore;

        const Node = (balanceImage: string) => (
            <Avatar
                source={{
                    uri: balanceImage
                }}
            />
        );

        return (
            <View>
                {!!nodes && nodes.length > 0 && (
                    <FlatList
                        data={nodes}
                        renderItem={({ item, index }) => {
                            const displayName =
                                item.implementation === 'lndhub'
                                    ? item.lndhubUrl
                                          .replace('https://', '')
                                          .replace('http://', '')
                                    : item.url
                                    ? item.url
                                          .replace('https://', '')
                                          .replace('http://', '')
                                    : item.port
                                    ? `${item.host}:${item.port}`
                                    : item.host || 'Unknown';

                            const title = PrivacyUtils.sensitiveValue(
                                displayName,
                                8
                            );
                            const implementation = PrivacyUtils.sensitiveValue(
                                item.implementation || 'lnd',
                                8
                            );

                            const data = new Identicon(
                                hash.sha1(
                                    item.implementation === 'lndhub'
                                        ? `${title}-${item.username}`
                                        : title
                                ),
                                255
                            ).toString();

                            return (
                                <React.Fragment>
                                    <ListItem
                                        title={`${title}`}
                                        leftElement={Node(
                                            `data:image/png;base64,${data}`
                                        )}
                                        rightElement={
                                            <Button
                                                title=""
                                                icon={{
                                                    name: 'settings',
                                                    size: 25,
                                                    color: themeColor('text')
                                                }}
                                                buttonStyle={{
                                                    backgroundColor:
                                                        'transparent',
                                                    marginRight: -10
                                                }}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        'AddEditNode',
                                                        {
                                                            node: item,
                                                            index: index,
                                                            active:
                                                                selectedNode ===
                                                                index,
                                                            saved: true
                                                        }
                                                    )
                                                }
                                            />
                                        }
                                        subtitle={
                                            selectedNode === index ||
                                            (!selectedNode && index === 0)
                                                ? `Active | ${implementation}`
                                                : `${implementation}`
                                        }
                                        containerStyle={{
                                            borderBottomWidth: 0,
                                            backgroundColor: themeColor(
                                                'background'
                                            )
                                        }}
                                        onPress={() => {
                                            setSettings(
                                                JSON.stringify({
                                                    nodes,
                                                    theme: settings.theme,
                                                    selectedNode: index,
                                                    onChainAddress:
                                                        settings.onChainAddress,
                                                    fiat: settings.fiat,
                                                    lurkerMode:
                                                        settings.lurkerMode,
                                                    passphrase:
                                                        settings.passphrase
                                                })
                                            ).then(() => {
                                                navigation.navigate('Wallet', {
                                                    refresh: true
                                                });
                                            });
                                        }}
                                        titleStyle={{
                                            color: themeColor('text')
                                        }}
                                        subtitleStyle={{
                                            color: themeColor('secondaryText')
                                        }}
                                    />
                                </React.Fragment>
                            );
                        }}
                        refreshing={loading}
                        keyExtractor={(item, index) => `${item.host}-${index}`}
                        ItemSeparatorComponent={this.renderSeparator}
                        onEndReachedThreshold={50}
                    />
                )}
                {nodes && nodes.length === 0 && !loading && (
                    <Button
                        title={localeString('views.Settings.Nodes.noNodes')}
                        icon={{
                            name: 'error-outline',
                            size: 25,
                            color: themeColor('text')
                        }}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            borderRadius: 30
                        }}
                        titleStyle={{
                            color: themeColor('text')
                        }}
                    />
                )}
                {!loading && (
                    <Button
                        title={localeString('views.Settings.Nodes.add')}
                        icon={{
                            name: 'add',
                            size: 25,
                            color: 'white'
                        }}
                        buttonStyle={{
                            borderRadius: 30,
                            width: 200,
                            alignSelf: 'center',
                            marginBottom: 20,
                            backgroundColor: 'crimson'
                        }}
                        onPress={() =>
                            navigation.navigate('AddEditNode', {
                                newEntry: true,
                                index:
                                    (nodes &&
                                        nodes.length &&
                                        Number(nodes.length)) ||
                                    0
                            })
                        }
                        titleStyle={{
                            color: 'white'
                        }}
                    />
                )}
            </View>
        );
    }
}
