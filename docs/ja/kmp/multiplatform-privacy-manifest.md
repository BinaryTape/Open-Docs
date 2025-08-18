[//]: # (title: iOSアプリのプライバシーマニフェスト)

Apple App Storeを対象とし、[必須理由API (required reasons API)](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)を使用しているアプリの場合、
App Store Connectは、アプリに正しいプライバシーマニフェスト (privacy manifest) がないという警告を発行する可能性があります。

![Required reasons warning](app-store-required-reasons-warning.png){width=700}

これは、ネイティブまたはマルチプラットフォームを問わず、あらゆるAppleエコシステムアプリに影響を与える可能性があります。あなたのアプリは、
サードパーティライブラリまたはSDKを介して必須理由APIを使用している可能性があり、それが明らかではない場合もあります。Kotlin Multiplatformも、
あなたが認識していないAPIを使用しているフレームワークの一つである可能性があります。

このページでは、問題の詳細な説明と、それに対処するための推奨事項を記載しています。

> このページは、Kotlinチームがこの問題について現在理解している内容を反映しています。
> 承認されたアプローチと回避策に関するより多くのデータと知識が得られ次第、ページを更新して反映します。
>
{style="tip"}

## 問題点

App Store提出物に関するAppleの要件は、[2024年春に変更されました](https://developer.apple.com/news/?id=r1henawx)。
[App Store Connect](https://appstoreconnect.apple.com)は、プライバシーマニフェストで必須理由APIの使用理由を指定していないアプリを受け入れなくなりました。

これは手動によるモデレーションではなく、自動チェックです。アプリのコードが分析され、メールで問題のリストが届きます。
そのメールには「ITMS-91053: Missing API declaration」という問題が参照され、アプリで使用されているAPIカテゴリのうち、
[必須理由](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)カテゴリに該当するすべてのAPIがリストアップされます。

理想的には、アプリが使用するすべてのSDKが独自のプライバシーマニフェストを提供し、それについて心配する必要はありません。
しかし、一部の依存関係がこれを行わない場合、App Storeへの提出がフラグ付けされる可能性があります。

## 解決方法

アプリを提出してApp Storeから詳細な問題リストを受け取った後、Appleのドキュメントに従ってマニフェストを作成できます。

*   [プライバシーマニフェストファイルの概要](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
*   [プライバシーマニフェストでのデータ使用の記述](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
*   [必須理由APIの使用の記述](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

結果のファイルはディクショナリの集合体です。アクセスされたAPIタイプごとに、提供されたリストから1つ以上の使用理由を選択します。
Xcodeは、`.xcprivacy` ファイルの編集を支援するために、ビジュアルレイアウトと各フィールドの有効な値を含むドロップダウンリストを提供します。

[特殊なツール](#find-usages-of-required-reason-apis)を使用して、Kotlinフレームワークの依存関係における必須理由APIの使用箇所を見つけ、
[別のプラグイン](#place-the-xcprivacy-file-in-your-kotlin-artifacts)を使用して、`.xcprivacy` ファイルをKotlinアーティファクトとバンドルできます。

新しいプライバシーマニフェストがApp Storeの要件を満たすのに役立たない場合、または手順を進める方法がわからない場合は、
[このYouTrack課題](https://youtrack.jetbrains.com/issue/KT-67603)でお問い合わせいただき、ケースを共有してください。

## 必須理由APIの使用箇所を見つける

アプリのKotlinコードまたは依存関係の1つが、`platform.posix` などのライブラリから `fstat` などの必須理由APIにアクセスする場合があります。

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

場合によっては、どの依存関係が必須理由APIを使用しているかを特定するのが難しいことがあります。
それらを見つけるのに役立つシンプルなツールを作成しました。

使用するには、Kotlinフレームワークがプロジェクトで宣言されているディレクトリで次のコマンドを実行します。

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

このスクリプトを[個別にダウンロード](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)し、
検査してから `python3` を使用して実行することもできます。

## .xcprivacyファイルをKotlinアーティファクトに配置する

`PrivacyInfo.xcprivacy` ファイルをKotlinアーティファクトにバンドルする必要がある場合は、`apple-privacy-manifests` プラグインを使用します。

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

このプラグインは、プライバシーマニフェストファイルを[対応する出力場所](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)にコピーします。

## 既知の使用箇所

### Compose Multiplatform

Compose Multiplatformを使用すると、バイナリで `fstat`、`stat`、および `mach_absolute_time` の使用が発生する可能性があります。
これらの関数はトラッキングやフィンガープリンティングには使用されず、デバイスから送信されることもありませんが、
Appleはそれらを必須理由が不足しているAPIとしてフラグを立てる可能性があります。

`stat` および `fstat` の使用理由を指定する必要がある場合は、`0A2A.1` を使用してください。
`mach_absolute_time` の場合は、`35F9.1` を使用してください。

Compose Multiplatformで使用される必須理由APIに関するさらなる更新については、[この課題](https://github.com/JetBrains/compose-multiplatform/issues/4738)をフォローしてください。

### Kotlin/Nativeランタイム バージョン1.9.10以前

`mach_absolute_time` APIは、Kotlin/Nativeランタイムの `mimalloc` アロケータで使用されています。これは、Kotlin 1.9.10以前のバージョンにおけるデフォルトのアロケータでした。

Kotlin 1.9.20以降のバージョンにアップグレードすることをお勧めします。アップグレードが不可能な場合は、メモリアロケータを変更してください。
これを行うには、Gradleビルドスクリプトで現在のKotlinアロケータに対して `-Xallocator=custom` コンパイルオプションを設定するか、
システムアロケータに対して `-Xallocator=std` を設定します。

詳細については、[Kotlin/Nativeメモリ管理](https://kotlinlang.org/docs/native-memory-manager.html)を参照してください。