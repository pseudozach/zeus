import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { RNCamera } from 'react-native-camera';
import { localeString } from './../utils/LocaleUtils';

interface QRProps {
    title: string;
    text: string;
    handleQRScanned: any;
    goBack: any;
}

interface QRState {
    cameraStatus: any;
}

export default class QRCodeScanner extends React.Component<QRProps, QRState> {
    state = {
        cameraStatus: null
    };

    handleCameraStatusChange = (event: any) => {
        this.setState({
            cameraStatus: event.cameraStatus
        });
    };

    render() {
        const { cameraStatus } = this.state;
        const { title, text, handleQRScanned, goBack } = this.props;

        return (
            <React.Fragment>
                <Header
                    leftComponent={
                        <Icon
                            name="arrow-back"
                            onPress={goBack}
                            color="#fff"
                            underlayColor="transparent"
                        />
                    }
                    centerComponent={{ text: title, style: { color: '#fff' } }}
                    backgroundColor="grey"
                />
                <View style={styles.content}>
                    <Text>{text}</Text>
                </View>
                {cameraStatus !==
                    RNCamera.Constants.CameraStatus.NOT_AUTHORIZED && (
                    <RNCamera
                        onBarCodeRead={(ret: any) => handleQRScanned(ret.data)}
                        style={{
                            flex: 1
                        }}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message:
                                'We need your permission to use your camera',
                            buttonPositive: 'OK',
                            buttonNegative: 'Cancel'
                        }}
                        captureAudio={false}
                        onStatusChange={this.handleCameraStatusChange}
                        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    />
                )}
                {cameraStatus ===
                    RNCamera.Constants.CameraStatus.NOT_AUTHORIZED && (
                    <View style={styles.content}>
                        <Text>
                            {localeString(
                                'components.QRCodeScanner.noCameraAccess'
                            )}
                        </Text>
                    </View>
                )}
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        paddingTop: 5
    }
});
