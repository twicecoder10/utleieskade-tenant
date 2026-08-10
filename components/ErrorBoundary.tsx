import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Sentry } from "@/utils/sentry";
import logger from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to Sentry
    logger.error("ErrorBoundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    });

    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#DC2626" }}>
              Something went wrong
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20, color: "#6B7280" }}>
              We're sorry, but something unexpected happened. The error has been reported to our team.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={{ backgroundColor: "#F3F4F6", padding: 15, borderRadius: 8, marginBottom: 20, width: "100%" }}>
                <Text style={{ fontSize: 12, fontFamily: "monospace", color: "#DC2626" }}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={this.handleReset}
              style={{
                backgroundColor: "#2387D4",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Try Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

