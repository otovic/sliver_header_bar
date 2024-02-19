import { Image, StatusBar, TouchableOpacity, View } from "react-native";
import { SliverHeaderBarProps, SliverHeaderBarState } from "./sliver_header_bar_types";
import { useEffect, useReducer, useRef, useState } from "react";

const reducer = (state: SliverHeaderBarState, action: number) => {
    if (action > 60 + state.statusBarHeight && action < 65 + state.statusBarHeight) {
        return { ...state, values: { margin: state.max - 60 - state.statusBarHeight, opacity: 1 } };
    }
    if (action < 60 + state.statusBarHeight) {
        return state;
    } else if (action > state.max) {
        return { ...state, values: { margin: 0, opacity: 0 } };
    } else {
        let opacity = 0;
        if (action < 100 + state.statusBarHeight) {
            opacity = 1 - ((action - 60 - state.statusBarHeight) / (40 - state.statusBarHeight));
            console.log(opacity);
        }
        return { ...state, values: { margin: state.max - action, opacity: opacity } };
    }
};

const SliverHeaderBar = (props: SliverHeaderBarProps) => {
    const lastPosition = useRef(0);
    const [calc, dispatch] = useReducer(reducer, {
        statusBarHeight: getStatusBarHeight(),
        values: { margin: 0, opacity: 0 },
        max: props.height ? props.height : 200
    });

    function getStatusBarHeight() {
        if (!props.fullscreen) return 0;
        return StatusBar.currentHeight ? StatusBar.currentHeight! : 0;
    }

    function getStatusBarColor() {
        if (props.fullscreen) return "rgba(255, 255, 255, " + calc.values.opacity + ")";
        return props.headerColor ? props.headerColor : "rgba(255, 255, 255, 1)";
    }

    useEffect(() => {
        StatusBar.setTranslucent(props.fullscreen ? true : false);
        StatusBar.setBackgroundColor(getStatusBarColor());
        StatusBar.currentHeight
    }, [calc.values.opacity]);

    useEffect(() => {
        return () => {
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor("rgba(255, 255, 255, 1)");
        }
    }, [])

    return (
        <>
            <View style={{
                width: "100%",
                height: 60,
                backgroundColor: "rgba(255, 255, 255, " + calc.values.opacity + ")",
                position: "absolute",
                top: calc.statusBarHeight,
                zIndex: 10,
                padding: 10,
                flexDirection: "row",
            }}>
                <View style={{
                    height: "100%",
                    borderColor: "black",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Image
                        source={require("../../../assets/back_arrow.png")}
                        style={{ width: 20, height: 20 }}
                    />
                </View>
                <View style={{
                    width: "100%",
                    height: "100%",
                    borderColor: "black",
                    borderWidth: 1,
                    flex: 2
                }}>

                </View>
            </View>
            <View style={{ width: "100%", height: props.height ? props.height : 200, backgroundColor: "white", marginTop: calc.values.margin * -1 }}>
                <View
                    onStartShouldSetResponder={() => true}
                    onResponderMove={(event) => {
                        const newPosition = event.nativeEvent.pageY;

                        if (lastPosition.current === 0) {
                            lastPosition.current = newPosition;
                        } else {
                            if (newPosition < lastPosition.current) {
                                dispatch(newPosition);
                            } else {
                                dispatch(newPosition);
                            }
                            lastPosition.current = newPosition;
                        }
                    }} style={{
                        width: "100%",
                        height: 20,
                        position: "absolute",
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <View style={{ width: 50, height: 5, backgroundColor: "gray", borderRadius: 10 }} />
                </View>
            </View>
        </>
    )
}

export default SliverHeaderBar;