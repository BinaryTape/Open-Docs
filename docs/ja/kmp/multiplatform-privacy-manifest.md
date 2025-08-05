[//]: # (title: iOSアプリのプライバシーマニフェスト)

アプリをApple App Store向けに開発していて、[必須理由API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)を使用している場合、App Store Connectから、アプリに正しいプライバシーマニフェストがないという警告が表示されることがあります。

![Required reasons warning](app-store-required-reasons-warning.png){width=700}

これは、ネイティブまたはマルチプラットフォームを問わず、あらゆるAppleエコシステムアプリに影響を与える可能性があります。アプリがサードパーティのライブラリやSDKを介して必須理由APIを使用している可能性があり、これは明らかではないかもしれません。Kotlin Multiplatformも、あなたが認識していないAPIを使用しているフレームワークの一つである可能性があります。

このページでは、この問題の詳細な説明と、それに対処するための推奨事項を説明します。

> このページは、Kotlinチームによるこの問題に対する現在の理解を反映しています。
> 承認されたアプローチと回避策に関するより多くのデータと知識が得られ次第、このページを更新していきます。
>
{style="tip"}

## 問題点

AppleのApp Storeへの申請要件は、[2024年春に変更されました](https://developer.apple.com/news/?id=r1henawx)。[App Store Connect](https://appstoreconnect.apple.com)は、プライバシーマニフェストで必須理由APIを使用する理由が指定されていないアプリを受け入れなくなりました。

これは手動でのモデレーションではなく、自動チェックです。アプリのコードが分析され、問題点のリストがメールで送られてきます。そのメールには、「ITMS-91053: Missing API declaration (API宣言の欠如)」という問題が記載され、アプリ内で使用されている[必須理由](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)カテゴリに該当するすべてのAPIカテゴリがリストアップされます。

理想的には、アプリが使用するすべてのSDKが独自のプライバシーマニフェストを提供しており、そのことを心配する必要はありません。しかし、一部の依存関係がこれを行わない場合、App Storeへの申請が指摘される可能性があります。

## 解決方法

アプリを申請してみてApp Storeから詳細な問題リストを受け取った後、Appleのドキュメントに従ってマニフェストを作成することができます。

*   [プライバシーマニフェストファイルの概要](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
*   [プライバシーマニフェストにおけるデータ使用の記述](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
*   [必須理由APIの使用の記述](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

生成されるファイルはディクショナリの集合です。アクセスするAPIタイプごとに、提供されたリストから使用する理由を1つ以上選択します。Xcodeは、視覚的なレイアウトと各フィールドの有効な値を含むドロップダウンリストを提供することで、`.xcprivacy`ファイルの編集を支援します。

[特別なツール](#find-usages-of-required-reason-apis)を使用してKotlinフレームワークの依存関係における必須理由APIの使用箇所を見つけ、[個別のプラグイン](#place-the-xcprivacy-file-in-your-kotlin-artifacts)を使用して`.xcprivacy`ファイルをKotlinアーティファクトにバンドルすることができます。

新しいプライバシーマニフェストがApp Storeの要件を満たすのに役立たない場合、または手順がわからない場合は、[このYouTrackイシュー](https://youtrack.jetbrains.com/issue/KT-67603)でケースを共有して当社にご連絡ください。

## 必須理由APIの使用箇所を見つける

アプリ内のKotlinコードまたは依存関係のいずれかが、`platform.posix`などのライブラリから必須理由API（例: `fstat`）にアクセスする場合があります。

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

場合によっては、どの依存関係が必須理由APIを使用しているかを特定するのが難しいことがあります。それらを見つけるのに役立つシンプルなツールを作成しました。

それを使用するには、プロジェクト内でKotlinフレームワークが宣言されているディレクトリで以下のコマンドを実行します。

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

このスクリプトは個別に[ダウンロード](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)して、内容を確認し、`python3`で実行することもできます。

## .xcprivacyファイルをKotlinアーティファクトに配置する

`PrivacyInfo.xcprivacy`ファイルをKotlinアーティファクトにバンドルする必要がある場合は、`apple-privacy-manifests`プラグインを使用します。

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

Compose Multiplatformを使用すると、バイナリ内で`fstat`、`stat`、`mach_absolute_time`が使用される可能性があります。これらの関数はトラッキングやフィンガープリンティングには使用されず、デバイスから送信されることもありませんが、Appleは依然としてそれらを必須理由が不足しているAPIとして指摘する可能性があります。

`stat`および`fstat`の使用に対して理由を指定する必要がある場合は、`0A2A.1`を使用します。`mach_absolute_time`の場合は、`35F9.1`を使用します。

Compose Multiplatformで使用される必須理由APIに関するさらなる更新については、[このイシュー](https://github.com/JetBrains/compose-multiplatform/issues/4738)をフォローしてください。

### Kotlin/Nativeランタイム バージョン1.9.10以前

`mach_absolute_time` APIは、Kotlin/Nativeランタイムの`mimalloc`アロケータで使用されています。これはKotlin 1.9.10以前のバージョンでのデフォルトアロケータでした。

Kotlin 1.9.20以降のバージョンへのアップグレードをお勧めします。アップグレードが不可能な場合は、メモリのアロケータを変更してください。そのためには、現在のKotlinアロケータに対してGradleビルドスクリプトで`-Xallocator=custom`コンパイルオプションを設定するか、システムアロケータに対して`-Xallocator=std`を設定します。

詳細については、[Kotlin/Nativeのメモリ管理](https://kotlinlang.org/docs/native-memory-manager.html)を参照してください。