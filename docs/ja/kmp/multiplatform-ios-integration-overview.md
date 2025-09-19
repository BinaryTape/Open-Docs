[//]: # (title: iOS統合方法)

Kotlin Multiplatform共有モジュールをiOSアプリに統合できます。そのためには、共有モジュールから[iOSフレームワーク](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)を生成し、それをiOSプロジェクトに依存関係として追加します。

![iOS integration scheme](ios-integration-scheme.svg)

このフレームワークは、ローカル依存関係またはリモート依存関係として利用できます。共通コードが変更されたときに、コードベース全体を完全に制御し、最終的なアプリケーションに即座に更新を反映させたい場合は、ローカル統合を選択してください。

最終的なアプリケーションのコードベースと共通コードベースを明示的に分離したい場合は、リモート統合を設定します。この場合、共有コードは通常のサードパーティ依存関係のように最終的なアプリケーションに統合されます。

## ローカル統合

ローカル設定には、主に2つの統合オプションがあります。特殊なスクリプトを介して直接統合を使用できます。これにより、KotlinのビルドがiOSビルドの一部になります。Kotlin MultiplatformプロジェクトにPodの依存関係がある場合は、CocoaPods統合アプローチを使用してください。

### 直接統合

Xcodeプロジェクトに特殊なスクリプトを追加することで、Kotlin MultiplatformプロジェクトからiOSフレームワークを直接接続できます。このスクリプトは、プロジェクトのビルド設定のビルドフェーズに統合されます。

この統合方法は、Kotlin MultiplatformプロジェクトでCocoaPodsの依存関係をインポート**しない**場合に有効です。

[Kotlin Multiplatform IDEプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)を使用する場合、直接統合がデフォルトで適用されます。

詳細については、[直接統合](multiplatform-direct-integration.md)を参照してください。

### ローカルpodspecを使用したCocoaPods統合

SwiftおよびObjective-Cプロジェクト向けの一般的な依存関係マネージャーである[CocoaPods](https://cocoapods.org/)を介して、Kotlin MultiplatformプロジェクトからiOSフレームワークを接続できます。

この統合方法は、以下の場合に有効です。

*   CocoaPodsを使用するiOSプロジェクトを含むモノリポジトリ設定がある場合
*   Kotlin MultiplatformプロジェクトでCocoaPodsの依存関係をインポートしている場合

ローカルのCocoaPods依存関係を持つワークフローを設定するには、スクリプトを手動で編集できます。

詳細については、[CocoaPodsの概要とセットアップ](multiplatform-cocoapods-overview.md)を参照してください。

## リモート統合

リモート統合の場合、Kotlin MultiplatformプロジェクトからiOSフレームワークを接続するために、プロジェクトはSwift Package Manager (SPM) またはCocoaPods依存関係マネージャーを使用する可能性があります。

### XCFrameworksを使用したSwift Package Manager

XCFrameworksを使用してSwift Package Manager (SPM)の依存関係を設定し、Kotlin MultiplatformプロジェクトからiOSフレームワークを接続できます。

詳細については、[Swiftパッケージのエクスポート設定](multiplatform-spm-export.md)を参照してください。

### XCFrameworksを使用したCocoaPods統合

Kotlin CocoaPods Gradleプラグインを使用してXCFrameworksをビルドし、プロジェクトの共有部分をモバイルアプリとは別にCocoaPodsを介して配布できます。

詳細については、[最終的なネイティブバイナリのビルド](multiplatform-build-native-binaries.md#build-frameworks)を参照してください。