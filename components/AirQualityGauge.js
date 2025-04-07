"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import Svg, { Path, G, Text as SvgText, Circle } from "react-native-svg"

const AirQualityGauge = ({ value }) => {
  const clampedValue = Math.min(1500, Math.max(0, value))
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clampedValue,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [clampedValue, animatedValue])

  const width = 300
  const height = 180 
  const strokeWidth = 30
  const radius = height - strokeWidth / 2 - 30

  const getColor = (value) => {
    if (value <= 600) return "#ffff00"
    if (value <= 300) return "#00e400"
    if (value <= 1000) return "#ff7e00"
    if (value <= 1500) return "#ff0000"
    if (value <= 2000) return "#8f3f97"
    return "#7e0023"
  }

  const getStatus = (value) => {
    if (value <= 600) return "Moderado"
    if (value <= 300) return "Bueno"
    if (value <= 1000) return "Pobre"
    if (value <= 1500) return "Muy Pobre"
    if (value <= 2000) return "Extremadamente mala"
    return "Peligroso"
  }

  const AnimatedG = Animated.createAnimatedComponent(G)

  const createArc = (start, end, color) => {
    const startAngle = (start / 1500) * Math.PI
    const endAngle = (end / 1500) * Math.PI
    const x1 = width / 2 + radius * Math.cos(startAngle)
    const y1 = height - radius * Math.sin(startAngle)
    const x2 = width / 2 + radius * Math.cos(endAngle)
    const y2 = height - radius * Math.sin(endAngle)
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1"

    return (
      <Path
        key={start}
        d={`M${x1},${y1} A${radius},${radius} 0 ${largeArcFlag} 0 ${x2},${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    )
  }

  const segments = [
    { start: 0, end: 300, color: "#00e400", label: "0" },
    { start: 300, end: 600, color: "#ffff00", label: "300" },
    { start: 600, end: 1000, color: "#ff7e00", label: "600" },
    { start: 1000, end: 1500, color: "#ff0000", label: "1000" },
  ]

  const createLabel = (angle, label) => {
    const x = width / 2 + (radius + 20) * Math.cos((angle * Math.PI) / 180)
    const y = height - (radius + 20) * Math.sin((angle * Math.PI) / 180)
    return (
      <SvgText key={label} x={x} y={y} fontSize="12" fill="#fff" textAnchor="middle" alignmentBaseline="middle">
        {label}
      </SvgText>
    )
  }

  const needleLength = radius - 10

  return (
    <View style={styles.container}>
      <Svg height={height + 60} width={width}> 
        {segments.map((segment) => createArc(segment.start, segment.end, segment.color))}
        {segments.map((segment) => createLabel((segment.start / 1500) * 180, segment.label))}

        <AnimatedG
          rotation={animatedValue.interpolate({
            inputRange: [0, 1500],
            outputRange: ["0", "180"],
          })}
          origin={`${width / 2}, ${height}`}
        >
          <Path 
            d={`M${width / 2},${height} L${width / 2},${height - needleLength}`} 
            stroke="white" 
            strokeWidth="2" 
          />
          <Circle cx={width / 2} cy={height} r={10} fill="white" />
        </AnimatedG>

        <SvgText x={width / 2} y={height - 20} fontSize="40" fontWeight="bold" fill="#fff" textAnchor="middle">
          {Math.round(clampedValue)}
        </SvgText>

        <SvgText x={width / 2} y={height + 10} fontSize="20" fill="#fff" textAnchor="middle">
          ICA
        </SvgText>
      </Svg>
      <Text style={[styles.status, { color: getColor(clampedValue) }]}>{getStatus(clampedValue)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
})

export default AirQualityGauge
