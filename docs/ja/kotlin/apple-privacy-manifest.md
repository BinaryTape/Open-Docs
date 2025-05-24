---
title: iOSアプリのプライバシーマニフェスト
---
アプリが Apple App Store 向けで、[必要な理由 API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api) を使用している場合、App Store Connect から、アプリに正しいプライバシーマニフェストがないという警告が表示されることがあります。

<img src="/img/app-store-required-reasons-warning.png" alt="必要な理由の警告" width="700" style={{verticalAlign: 'middle'}}/>

これは、ネイティブまたはマルチプラットフォームの、Apple エコシステムアプリに影響を与える可能性があります。アプリは、サードパーティのライブラリまたは SDK を介して必要な理由 API を使用している可能性があり、それは明らかではないかもしれません。Kotlin Multiplatform は、あなたが認識していない API を使用するフレームワークの 1 つである可能性があります。

このページでは、問題の詳細な説明と、それに対処するための推奨事項を紹介します。

:::tip
このページは、この問題に関する Kotlin チームの現在の理解を反映しています。
受け入れられたアプローチと回避策に関するデータと知識が増えるにつれて、それらを反映するようにページを更新していきます。

:::

## 問題点

App Store への提出に関する Apple の要件は、[2024 年の春に変わりました](https://developer.apple.com/news/?id=r1henawx)。
[App Store Connect](https://appstoreconnect.apple.com) は、プライバシーマニフェストで必要な理由 API を使用する理由を指定していないアプリを受け付けなくなりました。

これは手動の審査ではなく、自動チェックです。アプリのコードが分析され、メールで問題のリストが届きます。メールには「ITMS-91053: Missing API declaration」という問題が記載され、[必要な理由](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api) カテゴリに該当する、アプリで使用されているすべての API カテゴリがリストされます。

理想的には、アプリが使用するすべての SDK が独自のプライバシーマニフェストを提供し、それについて心配する必要はありません。
しかし、一部の依存関係がこれを行わない場合、App Store への提出にフラグが立てられる可能性があります。

## 解決方法

アプリの提出を試みて、App Store から詳細な問題リストを受け取った後、Apple のドキュメントに従ってマニフェストを作成できます。

* [Privacy manifest files overview](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [Describing data use in privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

結果として得られるファイルは、辞書のコレクションです。アクセスされた API タイプごとに、提供されたリストからそれを使用する 1 つまたは複数の理由を選択します。Xcode は、各フィールドの有効な値を持つビジュアルレイアウトとドロップダウンリストを提供することで、`.xcprivacy` ファイルの編集を支援します。

[特別なツール](#find-usages-of-required-reason-apis)を使用して、Kotlin フレームワークの依存関係における必要な理由 API の使用箇所を検索し、[別のプラグイン](#place-the-xcprivacy-file-in-your-kotlin-artifacts)を使用して `.xcprivacy` ファイルを Kotlin アーティファクトにバンドルできます。

新しいプライバシーマニフェストが App Store の要件を満たすのに役立たない場合、または手順を進める方法がわからない場合は、お問い合わせいただき、[この YouTrack issue](https://youtrack.jetbrains.com/issue/KT-67603) であなたのケースを共有してください。

## 必要な理由 API の使用箇所を検索する

アプリまたは依存関係の 1 つにある Kotlin コードは、たとえば `platform.posix` などのライブラリから必要な理由 API (例: `fstat`) にアクセスする可能性があります。

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

場合によっては、どの依存関係が必要な理由 API を使用しているかを判断するのが難しい場合があります。
それらを見つけるのに役立つように、簡単なツールを作成しました。

これを使用するには、プロジェクトで Kotlin フレームワークが宣言されているディレクトリで、次のコマンドを実行します。

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

[このスクリプトを個別にダウンロード](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py) し、それを調べてから `python3` を使用して実行することもできます。

## .xcprivacy ファイルを Kotlin アーティファクトに配置する

`PrivacyInfo.xcprivacy` ファイルを Kotlin アーティファクトにバンドルする必要がある場合は、`apple-privacy-manifests` プラグインを使用します。

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

このプラグインは、プライバシーマニフェストファイルを[対応する出力場所](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc)にコピーします。

## 既知の使用箇所

### Compose Multiplatform

Compose Multiplatform を使用すると、バイナリで `fstat`、`stat`、`mach_absolute_time` が使用される可能性があります。
これらの関数は、追跡やフィンガープリンティングには使用されず、デバイスから送信されることもありませんが、Apple はそれらを必要な理由が欠落している API としてフラグを立てる可能性があります。

`stat` と `fstat` の使用理由を指定する必要がある場合は、`0A2A.1` を使用します。`mach_absolute_time` の場合は、`35F9.1` を使用します。

Compose Multiplatform で使用される必要な理由 API の最新情報については、[この issue](https://github.com/JetBrains/compose-multiplatform/issues/4738) をフォローしてください。

### Kotlin/Native ランタイム バージョン 1.9.10 以前

`mach_absolute_time` API は、Kotlin/Native ランタイムの `mimalloc` アロケータで使用されます。これは、Kotlin 1.9.10 以前のバージョンでのデフォルトのアロケータでした。

Kotlin 1.9.20 以降のバージョンにアップグレードすることをお勧めします。アップグレードが不可能な場合は、メモリアロケータを変更してください。
これを行うには、現在の Kotlin アロケータの場合は Gradle ビルドスクリプトで `-Xallocator=custom` コンパイルオプションを設定し、システムアロケータの場合は `-Xallocator=std` を設定します。

詳細については、[Kotlin/Native memory management](native-memory-manager) を参照してください。