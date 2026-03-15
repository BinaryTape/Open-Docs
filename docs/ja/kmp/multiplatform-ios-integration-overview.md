[//]: # (title: iOS 統合方法)

Kotlin Multiplatform の共有モジュールを iOS アプリに統合できます。そのためには、共有モジュールから [iOS フレームワーク](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)を生成し、それを iOS プロジェクトに依存関係として追加します。

![iOS 統合スキーム](ios-integration-scheme.svg)

このフレームワークは、ローカルまたはリモートの依存関係として利用できます。コードベース全体を完全に制御し、共通コードの変更を最終的なアプリケーションに即座に反映させたい場合は、ローカル統合を選択してください。

最終的なアプリケーションのコードベースを共通コードベースから明示的に分離したい場合は、リモート統合を設定します。この場合、共有コードは通常のサードパーティ製依存関係のように最終的なアプリケーションに統合されます。

## ローカル統合

ローカルセットアップでは、主に 2 つの統合オプションがあります。特別なスクリプトによる直接統合を使用でき、これにより Kotlin のビルドが iOS のビルドの一部になります。Kotlin Multiplatform プロジェクトに Pod の依存関係がある場合は、CocoaPods 統合のアプローチを採用してください。

### 直接統合

Xcode プロジェクトに特別なスクリプトを追加することで、Kotlin Multiplatform プロジェクトから iOS フレームワークを直接接続できます。このスクリプトは、プロジェクトのビルド設定のビルドフェーズ（build phase）に統合されます。

この統合方法は、Kotlin Multiplatform プロジェクトで CocoaPods の依存関係をインポート**しない**場合に適しています。

[Kotlin Multiplatform IDE プラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)を使用している場合、デフォルトで直接統合が適用されます。

詳細については、[直接統合](multiplatform-direct-integration.md)を参照してください。

### ローカル podspec による CocoaPods 統合

Swift および Objective-C プロジェクトで一般的な依存関係マネージャーである [CocoaPods](https://cocoapods.org/) を介して、Kotlin Multiplatform プロジェクトから iOS フレームワークを接続できます。

この統合方法は、以下の場合に適しています：

* CocoaPods を使用する iOS プロジェクトを含むモノリポジトリ（mono repository）構成である場合
* Kotlin Multiplatform プロジェクトで CocoaPods の依存関係をインポートしている場合

ローカルの CocoaPods 依存関係を使用したワークフローを設定するには、スクリプトを手動で編集できます。

詳細については、[CocoaPods の概要とセットアップ](multiplatform-cocoapods-overview.md)を参照してください。

## リモート統合

リモート統合では、プロジェクトで Swift Package Manager (SwiftPM) または CocoaPods 依存関係マネージャーを使用して、Kotlin Multiplatform プロジェクトから iOS フレームワークを接続できます。

### XCFrameworks を使用した Swift Package Manager

XCFrameworks を使用して Swift Package Manager (SwiftPM) の依存関係を設定し、Kotlin Multiplatform プロジェクトから iOS フレームワークを接続できます。

詳細については、[Swift パッケージのエクスポート設定](multiplatform-spm-export.md)を参照してください。

### XCFrameworks を使用した CocoaPods 統合

Kotlin CocoaPods Gradle プラグインを使用して XCFrameworks をビルドし、プロジェクトの共有部分を CocoaPods 経由でモバイルアプリとは別に配布できます。

詳細については、[最終的なネイティブバイナリのビルド](multiplatform-build-native-binaries.md#build-frameworks)を参照してください。