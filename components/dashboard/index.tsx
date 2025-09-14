import { useDashboard } from "@/hooks/api";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import EarthCard from "./earth-card";
import TreeCard from "./tree-card";
import WhaleCard from "./whale-card";

const Dashboard = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const {
    data: dashboardData,
    isLoading: loadingDashboard,
    refetch: refetchDashboard,
  } = useDashboard();

  return (
    <View style={[styles.dashboard, isTablet && styles.dashboard_tablet]}>
      <EarthCard
        isTablet={isTablet}
        co2Value={dashboardData?.co2 || 0}
        isLoading={loadingDashboard}
      />

      <View
        style={[
          styles.dashboard__statsGrid,
          isTablet && styles.dashboard__statsGrid_tablet,
        ]}
      >
        <WhaleCard
          isTablet={isTablet}
          plasticValue={dashboardData?.plastic || 0}
          isLoading={loadingDashboard}
        />
        <TreeCard
          isTablet={isTablet}
          treesValue={dashboardData?.trees || 0}
          isLoading={loadingDashboard}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    width: "100%",
    alignItems: "center",
    padding: 8,
  },
  dashboard_tablet: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dashboard__statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "98%",
  },
  dashboard__statsGrid_tablet: {
    flexDirection: "column",
    height: 400,
    justifyContent: "space-between",
    width: 260,
  },
});

export default Dashboard;
