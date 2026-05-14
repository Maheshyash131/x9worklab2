import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check } from "phosphor-react-native";

export default function StepProgress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <View style={styles.wrap}>
      {labels.map((label, idx) => {
        const i = idx + 1;
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={label}>
            <View style={{ alignItems: "center", width: 84 }}>
              <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                {done ? <Check size={16} color="#fff" weight="bold" /> : <Text style={[styles.dotNum, active && { color: "#fff" }] }>{i}</Text>}
              </View>
              <Text style={[styles.lbl, (done || active) && { color: "#D88D07", fontWeight: "700" }]} numberOfLines={1}>
                {label}
              </Text>
            </View>
            {idx < labels.length - 1 && (
              <View style={[styles.bar, i < step && { backgroundColor: "#D88D07" }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center", marginTop: 22, marginBottom: 8 },
  dot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#F0E4CC" },
  dotDone: { backgroundColor: "#3F9B2E" },
  dotActive: { backgroundColor: "#D88D07" },
  dotNum: { color: "#9A8E80", fontWeight: "800" },
  lbl: { color: "#9A8E80", fontSize: 11, marginTop: 6, textAlign: "center" },
  bar: { flex: 1, height: 2, backgroundColor: "#F0E4CC", marginTop: 16, marginHorizontal: -10, maxWidth: 50 },
});
