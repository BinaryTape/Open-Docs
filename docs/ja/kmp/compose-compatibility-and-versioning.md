[//]: # (title: 互換性とバージョン)

Compose Multiplatformのリリースは、KotlinおよびJetpack Composeのリリースとは別に提供されます。このページでは、Compose Multiplatformのリリース、Composeのリリースサイクル、およびコンポーネントの互換性に関する情報を提供します。

## サポートされているプラットフォーム

Compose Multiplatform %org.jetbrains.compose% は、以下のプラットフォームをサポートしています。

| プラットフォーム | 最小バージョン                                                                                        |
|----------|--------------------------------------------------------------------------------------------------------|
| Android  | Android 5.0 (API level 21)                                                                             |
| iOS      | iOS 13                                                                                                 |
| macOS    | macOS 12 x64, macOS 13 arm64                                                                           |
| Windows  | Windows 10 (x86-64, arm64)                                                                             |
| Linux    | Ubuntu 20.04 (x86-64, arm64)                                                                           |
| Web      | [WasmGCサポート](https://kotlinlang.org/docs/wasm-configuration.html#browser-versions)のあるブラウザ |

[//]: # (https://youtrack.jetbrains.com/issue/CMP-7539)

> Compose Multiplatformのすべてのリリースは、64ビットプラットフォームのみをサポートしています。
> 
{style="note"}

## Kotlinの互換性

最新のCompose Multiplatformは、常に最新バージョンのKotlinと互換性があります。
バージョンを手動で合わせる必要はありません。
いずれかの製品のEAPバージョンを使用すると、まだ不安定になる可能性があることに注意してください。

Compose Multiplatformは、Kotlin Multiplatformプラグインと同じバージョンのCompose Compiler Gradleプラグインが適用されている必要があります。
詳細については、[undefined](compose-compiler.md#migrating-a-compose-multiplatform-project)を参照してください。

> Compose Multiplatform 1.8.0以降、UIフレームワークはK2コンパイラに完全に移行しました。
> したがって、最新のCompose Multiplatformリリースを使用するには、以下を行う必要があります。
> * プロジェクトにKotlin 2.1.0以上を使用する、
> * Compose Multiplatformベースのライブラリは、Kotlin 2.1.0以上でコンパイルされている場合にのみ依存する。
> 
> すべての依存関係が更新されるまでの後方互換性の問題に対する回避策として、
> `gradle.properties`ファイルに`kotlin.native.cacheKind=none`を追加することで、Gradleキャッシュをオフにできます。
> これにより、コンパイル時間が長くなります。
>
{style="warning"}

## デスクトップ版Compose Multiplatformの制限事項

デスクトップ版Compose Multiplatformは、[Skia](https://skia.org/)バインディングで使用されているメモリ管理スキームにより、JDK 11以降のみがサポートされています。

加えて：
* [`jpackage`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jpackage.html)の制限により、ネイティブディストリビューションのパッケージングにはJDK 17以降のみがサポートされています。
* macOSでキーボードレイアウトを切り替える際に、OpenJDK 11.0.12に既知の[問題](https://github.com/JetBrains/compose-multiplatform/issues/940)があります。この問題はOpenJDK 11.0.15では再現されません。

## Jetpack ComposeとCompose Multiplatformのリリースサイクル

Compose Multiplatformは、Googleが開発したフレームワークであるAndroid版[Jetpack Compose](https://developer.android.com/jetpack/compose)と多くのコードを共有しています。共通コードが適切にテストされ、安定化されるように、Compose MultiplatformのリリースサイクルをJetpack Composeのリリースサイクルに合わせています。

Jetpack Composeの新しいバージョンがリリースされると、弊社は以下を行います。

1. 次の[Compose Multiplatform](https://github.com/JetBrains/androidx)バージョンのベースとして、リリースコミットを使用します。
2. 新しいプラットフォーム機能のサポートを追加します。
3. すべてのプラットフォームを安定化させます。
4. Compose Multiplatformの新しいバージョンをリリースします。

Compose MultiplatformのリリースとJetpack Composeのリリースの間隔は、通常1〜3ヶ月です。

### Compose Multiplatformの開発バージョン

Compose Multiplatformコンパイラプラグインの開発バージョン（例: `1.8.2+dev2544`）は、正式リリース間のアップデートをテストするために、定められたスケジュールなしでビルドされます。

これらのビルドは[Maven Central](https://central.sonatype.com/)では利用できません。
それらにアクセスするには、リポジトリのリストにこの行を追加します。

```kotlin
maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
```

### 使用されるJetpack Composeアーティファクト

Android向けにアプリケーションをビルドする際、Compose MultiplatformはGoogleが公開するアーティファクトを使用します。
例えば、Compose Multiplatform 1.5.0 Gradleプラグインを適用し、`dependencies`に`implementation(compose.material3)`を追加すると、Androidターゲットでは`androidx.compose.material3:material3:1.1.1`アーティファクトが使用されます（ただし、他のターゲットでは`org.jetbrains.compose.material3:material3:1.5.0`が使用されます）。

以下の表は、各Compose Multiplatformバージョンで使用されるJetpack Composeアーティファクトのバージョンを示しています。

| Compose Multiplatformバージョン                                                     | Jetpack Composeバージョン | Jetpack Compose Material3バージョン |
|-----------------------------------------------------------------------------------|-------------------------|-----------------------------------|
| [1.9.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.3)   | 1.9.4                   | 1.4.0                             |
| [1.8.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.2)   | 1.8.2                   | 1.3.2                             |
| [1.7.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.3)   | 1.7.6                   | 1.3.1                             |
| [1.7.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.1)   | 1.7.5                   | 1.3.1                             |
| [1.7.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.0)   | 1.7.1                   | 1.3.0                             |
| [1.6.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.11) | 1.6.7                   | 1.2.1                             |
| [1.6.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.10) | 1.6.7                   | 1.2.1                             |
| [1.6.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.2)   | 1.6.4                   | 1.2.1                             |
| [1.6.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.1)   | 1.6.3                   | 1.2.1                             |
| [1.6.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.0)   | 1.6.1                   | 1.2.0                             |
| [1.5.12](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.12) | 1.5.4                   | 1.1.2                             |
| [1.5.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.11) | 1.5.4                   | 1.1.2                             |
| [1.5.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.10) | 1.5.4                   | 1.1.2                             |
| [1.5.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.1)   | 1.5.0                   | 1.1.1                             |
| [1.5.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.0)   | 1.5.0                   | 1.1.1                             |
| [1.4.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.3)   | 1.4.3                   | 1.0.1                             |
| [1.4.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.1)   | 1.4.3                   | 1.0.1                             |
| [1.4.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.0)   | 1.4.0                   | 1.0.1                             |
| [1.3.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.1)   | 1.3.3                   | 1.0.1                             |
| [1.3.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.0)   | 1.3.3                   | 1.0.1                             |
| [1.2.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.1)   | 1.2.1                   | 1.0.0-alpha14                     |
| [1.2.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.0)   | 1.2.1                   | 1.0.0-alpha14                     |
| [1.1.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.1)   | 1.1.0                   | 1.0.0-alpha05                     |
| [1.1.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.0)   | 1.1.0                   | 1.0.0-alpha05                     |
| [1.0.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.1)   | 1.1.0-beta02            | 1.0.0-alpha03                     |
| [1.0.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.0)   | 1.1.0-beta02            | 1.0.0-alpha03                     |