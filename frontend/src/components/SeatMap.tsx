import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

interface SeatMapProps {
  selectedSections?: Set<string>;
  onSectionPress?: (section: string) => void;
}

export default function SeatMap({ selectedSections = new Set(), onSectionPress }: SeatMapProps) {
  const sectionColors: Record<string, string> = {
    stage: colors.surfaceMuted,
    'Floor A': colors.primary,
    'Floor B': '#4f46e5',
    'Lower Level': '#7c3aed',
    'Upper Level': colors.primaryLight,
    'VIP Box': colors.destructive,
  };

  const isSelectable = !!onSectionPress;
  const getSectionStyle = (section: string) => {
    const baseColor = sectionColors[section];
    const selected = selectedSections.has(section);
    return {
      fill: baseColor,
      stroke: selected ? '#fff' : 'transparent',
      strokeWidth: selected ? 3 : 0,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        {Object.entries(sectionColors).map(([name, color]) => (
          <View key={name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{name}</Text>
          </View>
        ))}
      </View>

      <Svg viewBox="0 0 320 280" width="100%" height={280} style={styles.svg}>
        {/* Stage - not selectable */}
        <Rect x={80} y={220} width={160} height={50} rx={4} fill={sectionColors.stage} />
        <SvgText x={160} y={245} fill="#6c757d" fontSize={11} fontWeight="700" textAnchor="middle">
          STAGE
        </SvgText>

        {/* Floor A */}
        <Rect
          x={60}
          y={165}
          width={90}
          height={50}
          rx={4}
          fill={getSectionStyle('Floor A').fill}
          stroke={getSectionStyle('Floor A').stroke}
          strokeWidth={getSectionStyle('Floor A').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('Floor A') : undefined}
        />
        <SvgText x={105} y={192} fill="#fff" fontSize={11} fontWeight="600" textAnchor="middle">
          Floor A
        </SvgText>

        {/* Floor B */}
        <Rect
          x={170}
          y={165}
          width={90}
          height={50}
          rx={4}
          fill={getSectionStyle('Floor B').fill}
          stroke={getSectionStyle('Floor B').stroke}
          strokeWidth={getSectionStyle('Floor B').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('Floor B') : undefined}
        />
        <SvgText x={215} y={192} fill="#fff" fontSize={11} fontWeight="600" textAnchor="middle">
          Floor B
        </SvgText>

        {/* Lower Level - curved bowl */}
        <Path
          d="M 40 100 Q 160 60 280 100 L 260 155 Q 160 120 60 155 Z"
          fill={getSectionStyle('Lower Level').fill}
          stroke={getSectionStyle('Lower Level').stroke}
          strokeWidth={getSectionStyle('Lower Level').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('Lower Level') : undefined}
        />
        <SvgText x={160} y={128} fill="#fff" fontSize={11} fontWeight="600" textAnchor="middle">
          Lower Level
        </SvgText>

        {/* Upper Level */}
        <Path
          d="M 30 20 Q 160 0 290 20 L 270 95 Q 160 75 50 95 Z"
          fill={getSectionStyle('Upper Level').fill}
          stroke={getSectionStyle('Upper Level').stroke}
          strokeWidth={getSectionStyle('Upper Level').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('Upper Level') : undefined}
        />
        <SvgText x={160} y={58} fill="#fff" fontSize={11} fontWeight="600" textAnchor="middle">
          Upper Level
        </SvgText>

        {/* VIP Box - left */}
        <Rect
          x={10}
          y={100}
          width={35}
          height={80}
          rx={4}
          fill={getSectionStyle('VIP Box').fill}
          stroke={getSectionStyle('VIP Box').stroke}
          strokeWidth={getSectionStyle('VIP Box').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('VIP Box') : undefined}
        />
        <SvgText x={27} y={140} fill="#fff" fontSize={10} fontWeight="700" textAnchor="middle">
          VIP
        </SvgText>

        {/* VIP Box - right - same section, share selection state */}
        <Rect
          x={275}
          y={100}
          width={35}
          height={80}
          rx={4}
          fill={getSectionStyle('VIP Box').fill}
          stroke={getSectionStyle('VIP Box').stroke}
          strokeWidth={getSectionStyle('VIP Box').strokeWidth}
          onPress={isSelectable ? () => onSectionPress?.('VIP Box') : undefined}
        />
        <SvgText x={292} y={140} fill="#fff" fontSize={10} fontWeight="700" textAnchor="middle">
          VIP
        </SvgText>
      </Svg>

      <Text style={styles.hint}>
        {isSelectable ? 'Tap sections to select options' : 'View from above • Stage at bottom'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#c8c8c8',
    fontSize: 12,
    fontWeight: '600',
  },
  svg: {
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  hint: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 12,
  },
});