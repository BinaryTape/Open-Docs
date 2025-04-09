---
title: iOSの統合方法
---
Kotlin Multiplatformの共有モジュールをiOSアプリに統合できます。そのためには、共有モジュールから[iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)を生成し、それを依存関係としてiOSプロジェクトに追加します。

<img src="/img/ios-integration-scheme.svg" alt="iOS integration scheme" style={{verticalAlign: 'middle'}}/>

このframeworkは、ローカルまたはリモートの依存関係として利用できます。 コードベース全体を完全に制御し、共通コードの変更時に最終アプリケーションへの即時更新が必要な場合は、ローカル統合を選択してください。

最終アプリケーションのコードベースを共通コードベースから明示的に分離する場合は、リモート統合をセットアップします。 この場合、共有コードは、通常のサードパーティの依存関係のように最終アプリケーションに統合されます。

## ローカル統合

ローカルセットアップには、2つの主要な統合オプションがあります。 特別なスクリプトを介した直接統合を使用すると、KotlinのビルドがiOSのビルドの一部になります。 Kotlin MultiplatformプロジェクトにPodの依存関係がある場合は、CocoaPods統合アプローチを採用してください。

### 直接統合

特別なスクリプトをXcodeプロジェクトに追加することにより、Kotlin MultiplatformプロジェクトからiOS frameworkを直接接続できます。 スクリプトは、プロジェクトのビルド設定のビルドフェーズに統合されます。

この統合方法は、Kotlin MultiplatformプロジェクトでCocoaPodsの依存関係を**インポートしない**場合に有効です。

Android Studioでプロジェクトを作成する場合は、**Regular framework**オプションを選択して、このセットアップを自動的に生成します。[Kotlin Multiplatform web wizard](https://kmp.jetbrains.com/)を使用する場合、直接統合がデフォルトで適用されます。

詳細については、[直接統合](multiplatform-direct-integration)を参照してください。

### ローカルpodspecを使用したCocoaPods統合

SwiftおよびObjective-Cプロジェクトで広く使用されている依存関係マネージャーである[CocoaPods](https://cocoapods.org/)を介して、Kotlin MultiplatformプロジェクトからiOS frameworkを接続できます。

この統合方法は、次の場合に有効です。

* CocoaPodsを使用するiOSプロジェクトを含むモノレポ設定がある
* Kotlin MultiplatformプロジェクトでCocoaPodsの依存関係をインポートする

ローカルのCocoaPods依存関係を使用したワークフローをセットアップするには、スクリプトを手動で編集するか、Android Studioでウィザードを使用してプロジェクトを生成します。

詳細については、[CocoaPodsの概要とセットアップ](native-cocoapods)を参照してください。

## リモート統合

リモート統合では、プロジェクトでSwift Package Manager（SPM）またはCocoaPods依存関係マネージャーを使用して、Kotlin MultiplatformプロジェクトからiOS frameworkを接続できます。

### XCFrameworkを使用したSwift package manager

XCFrameworkを使用してSwift package manager（SPM）の依存関係をセットアップし、Kotlin MultiplatformプロジェクトからiOS frameworkを接続できます。

詳細については、[Swift package export setup](native-spm)を参照してください。

### XCFrameworkを使用したCocoaPods統合

Kotlin CocoaPods Gradleプラグインを使用してXCFrameworksを構築し、CocoaPodsを介してプロジェクトの共有部分をモバイルアプリとは別に配布できます。

詳細については、[最終的なネイティブバイナリの構築](multiplatform-build-native-binaries#build-frameworks)を参照してください。