[//]: # (title: iOS 連携方法)

Kotlin Multiplatform の共有モジュールを iOS アプリに統合できます。そのためには、共有モジュールから [iOS フレームワーク](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html) を生成し、それを iOS プロジェクトの依存関係として追加します。

![iOS 連携スキーム](ios-integration-scheme.svg)

このフレームワークは、ローカル依存関係またはリモート依存関係として利用できます。コードベース全体を完全に制御し、共通コードの変更時に最終アプリケーションへの即時更新を適用したい場合は、ローカル統合を選択します。

最終アプリケーションのコードベースを共通コードベースから明示的に分離したい場合は、リモート統合を設定します。この場合、共有コードは通常のサードパーティ依存関係のように最終アプリケーションに統合されます。

## ローカル統合

ローカルセットアップには、主に2つの統合オプションがあります。特別なスクリプトを使用して直接統合を行うことができます。これにより、Kotlin ビルドが iOS ビルドの一部になります。Kotlin Multiplatform プロジェクトに Pod 依存関係がある場合は、CocoaPods 統合アプローチを採用します。

### 直接統合

Xcode プロジェクトに特別なスクリプトを追加することで、Kotlin Multiplatform プロジェクトから iOS フレームワークを直接連携させることができます。このスクリプトは、プロジェクトのビルド設定のビルドフェーズに統合されます。

この統合方法は、Kotlin Multiplatform プロジェクトで CocoaPods 依存関係をインポートし**ない**場合に機能します。

Android Studio でプロジェクトを作成する場合、この設定を自動的に生成するには **Regular framework** オプションを選択します。[Kotlin Multiplatform ウェブウィザード](https://kmp.jetbrains.com/) を使用する場合、直接統合はデフォルトで適用されます。

詳細については、[直接統合](multiplatform-direct-integration.md) を参照してください。

### ローカル podspec を使用した CocoaPods 統合

Kotlin Multiplatform プロジェクトから iOS フレームワークを、Swift および Objective-C プロジェクトで人気の依存関係マネージャーである [CocoaPods](https://cocoapods.org/) を介して連携させることができます。

この統合方法は、次の場合に機能します。

*   CocoaPods を使用する iOS プロジェクトでモノリポジトリセットアップがある場合
*   Kotlin Multiplatform プロジェクトで CocoaPods 依存関係をインポートしている場合

ローカル CocoaPods 依存関係を使用したワークフローをセットアップするには、スクリプトを手動で編集するか、Android Studio のウィザードを使用してプロジェクトを生成することができます。

詳細については、[CocoaPods の概要とセットアップ](multiplatform-cocoapods-overview.md) を参照してください。

## リモート統合

リモート統合の場合、プロジェクトは Swift Package Manager (SPM) または CocoaPods 依存関係マネージャーを使用して、Kotlin Multiplatform プロジェクトから iOS フレームワークを連携させることができます。

### XCFrameworks を使用した Swift Package Manager

XCFrameworks を使用して Swift Package Manager (SPM) 依存関係を設定し、Kotlin Multiplatform プロジェクトから iOS フレームワークを連携させることができます。

詳細については、[Swift パッケージのエクスポート設定](multiplatform-spm-export.md) を参照してください。

### XCFrameworks を使用した CocoaPods 統合

Kotlin CocoaPods Gradle プラグインで XCFrameworks をビルドし、プロジェクトの共有部分をモバイルアプリとは別に CocoaPods を介して配布することができます。

詳細については、[最終ネイティブバイナリのビルド](multiplatform-build-native-binaries.md#build-frameworks) を参照してください。