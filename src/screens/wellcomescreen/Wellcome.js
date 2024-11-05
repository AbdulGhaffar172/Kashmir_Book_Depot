import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import Video from 'react-native-video';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2247973352794973/9668639365';

const Wellcome = ({ route }) => {
    const { Username, loginDate } = route.params;
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTutorialModal, setShowTutorialModal] = useState(false);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    useEffect(() => {
        fetchSummary();
        if (loginDate === "First Login") {
            setShowTutorialModal(true);
        }
    }, [loginDate]);

    const fetchSummary = async () => {
        try {
            const response = await fetch('https://pos.kashmirbookdepot.com/webservice/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `customer_id=${global.UserId}&query=fetch.summary`,
            });

            const result = await response.json();
            console.log(result);
            if (result && result.Orders !== undefined && result.Total !== undefined) {
                setSummary(result);
            } else {
                ToastAndroid.show('Failed to fetch summary data', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Fetch summary error:', error);
            ToastAndroid.show('Network error. Please try again later.', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoEnd = () => {
        setIsPlayingVideo(false);
        setShowTutorialModal(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headercontainer}>
            <View></View>
                <Text style={styles.text}>Kashmir Book Depot</Text>
                <TouchableOpacity onPress={() => setShowTutorialModal(true)}>
                    <Text style={styles.helpText}>Tutorial</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.maincontainer}>
                {/* Top Ad Banner */}
                <View style={styles.adContainer}>
                <BannerAd
    //   unitId={adUnitId}
    unitId='ca-app-pub-2247973352794973/9668639365'
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        networkExtras: {
          collapsible: 'top',
        },
      }}
    />
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 50 }}>
                    <Text style={styles.wellcomtext}>Welcome </Text>
                    <Text style={styles.usertext}>{Username}</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#cb0a36" />
                ) : (
                    <View style={{ marginHorizontal: 10, elevation: 10, backgroundColor: 'white' }}>
                        <View style={styles.summarycontainer}>
                            <Text style={styles.sumrytext}>Summary</Text>
                        </View>
                        <View style={styles.detailscontainer}>
                            <View style={styles.detailedcontainer}>
                                <View style={styles.balancecontainer}>
                                    <Text style={styles.balacetext}>Recent Balance</Text>
                                </View>
                                <View style={styles.lastlogincontainer}>
                                    <Text style={styles.balacetext}>Last Login</Text>
                                </View>
                            </View>
                            <View style={styles.detailedcontainer}>
                                <View style={styles.balancecontainer}>
                                    <Text style={styles.balacetext}>
                                        {summary ? ` ${Number(summary.Total).toLocaleString('en-IN')}` : 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.lastlogincontainer}>
                                    <Text style={styles.balacetext}>{loginDate || 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Bottom Ad Banner */}
                <View style={styles.adContainer1}>
                <BannerAd
    //   unitId={adUnitId}
    unitId='ca-app-pub-2247973352794973/9668639365'
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        networkExtras: {
          collapsible: 'bottom',
        },
      }}
    />
                </View>
            </View>

            {/* Tutorial Modal */}
            <Modal visible={showTutorialModal && !isPlayingVideo} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Do you want to see the Tutorial?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setIsPlayingVideo(true)}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setShowTutorialModal(false)}>
                                <Text style={styles.modalButtonText}>Skip</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Video Player */}
            {isPlayingVideo && (
                <Modal transparent={true}>
                    <View style={styles.videoContainer}>
                        <Video
                            source={require('../../assets/images/InShot_20241025_175352586.mp4')}
                            style={styles.video}
                            controls={true}
                            onEnd={handleVideoEnd}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    headercontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#cb0a36',
        height: 50,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
    },
    wellcomtext: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        marginVertical: 15,
    },
    usertext: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'red',
        marginVertical: 15,
    },
    summarycontainer: {
        backgroundColor: '#cb0a36',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#cb0a36',
    },
    balacetext: {
        color: 'black',
        fontSize: 15,
    },
    balancecontainer: {
        backgroundColor: 'white',
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        borderWidth: 0.5,
        borderColor: '#cb0a36',
    },
    lastlogincontainer: {
        backgroundColor: '#ffffff',
        height: 40,
        justifyContent: 'center',
        paddingLeft: 8,
        borderWidth: 0.5,
        borderColor: '#cb0a36',
    },
    detailscontainer: {
        flexDirection: 'row',
    },
    detailedcontainer: {
        width: '50%',
        borderWidth: 0.5,
        borderColor: '#cb0a36',
    },
    sumrytext: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    maincontainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#cb0a36',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    videoContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    helpText: {
        color: 'white',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
    adContainer: {
        height: '30%',
        padding: 10,
        width: '100%',
        alignItems: 'center',
        top: -40,
    },
    adContainer1: {
        height: '30%',
        padding: 10,
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: -290,
    },
});

export default Wellcome;
