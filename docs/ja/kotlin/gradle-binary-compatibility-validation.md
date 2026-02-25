[//]: # (title: Kotlin Gradle プラグインにおけるバイナリ互換性の検証)

<primary-label ref="experimental-general"/>

バイナリ互換性検証（Binary compatibility validation）は、ライブラリの作者が、ユーザーが新しいバージョンにアップグレードした際に既存のコードを壊さないようにするのに役立ちます。これは、スムーズなアップグレード体験を提供するだけでなく、ユーザーとの長期的な信頼関係を築き、ライブラリの継続的な採用を促すためにも重要です。

> バイナリ互換性とは、ライブラリの2つのバージョンのコンパイル済みバイトコードを、再コンパイルすることなく入れ替えて実行できることを意味します。
> 
{style="tip"}

バージョン 2.2.0 以降、Kotlin Gradle プラグインはバイナリ互換性の検証をサポートしています。この機能を有効にすると、現在のコードからアプリケーション・バイナリ・インターフェース（ABI: Application Binary Interface）ダンプを生成し、それを以前のダンプと比較して差異を浮き彫りにします。これらの変更を確認することで、バイナリ互換性を損なう可能性のある修正を特定し、対処することができます。

## 有効にする方法

バイナリ互換性の検証を有効にするには、`build.gradle.kts` ファイルの `kotlin{}` ブロックに以下を追加してください。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 古い Gradle バージョンとの互換性を確保するために set() 関数を使用します
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

プロジェクトにバイナリ互換性をチェックしたいモジュールが複数ある場合は、各モジュールを個別に設定してください。

## バイナリ互換性の問題を確認する

コードに変更を加えた後、バイナリ互換性を損なう可能性のある問題を確認するには、IntelliJ IDEA で `checkLegacyAbi` Gradle タスクを実行するか、プロジェクトディレクトリで以下のコマンドを使用します。

```bash
./gradlew checkLegacyAbi
```

このタスクは ABI ダンプを比較し、検出された差異をエラーとして出力します。出力を注意深く確認し、バイナリ互換性を維持するためにコードの修正が必要かどうかを判断してください。

## リファレンス ABI ダンプの更新

Gradle が最新の変更をチェックするために使用するリファレンス ABI ダンプを更新するには、IntelliJ IDEA で `updateLegacyAbi` タスクを実行するか、プロジェクトディレクトリで以下のコマンドを使用します。

```bash
./gradlew updateLegacyAbi
```

リファレンスダンプの更新は、変更が以前のバージョンとのバイナリ互換性を維持していると確信できる場合にのみ行ってください。

## フィルタの設定

ABI ダンプに含めるクラス、プロパティ、関数を制御するためのフィルタを定義できます。`filters {}` ブロックを使用し、`excluded {}` ブロックで除外ルールを、`included {}` ブロックで包含ルールをそれぞれ追加します。

Gradle は、宣言がいずれの除外ルールにも一致しない場合にのみ、その宣言を ABI ダンプに含めます。包含ルールが定義されている場合、宣言はそのルールのいずれかに一致するか、少なくとも1つのメンバーが一致する必要があります。

ルールは以下に基づいて設定できます：

* クラス、プロパティ、または関数の完全修飾名 (`byNames`)。
* BINARY または RUNTIME の [保持期間 (retention)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) を持つアノテーションの名前 (`annotatedWith`)。

> 名前のルールには、ワイルドカード `**`、`*`、および `?` を使用できます。
> * `**` はピリオドを含む0文字以上の文字に一致します。
> * `*` はピリオドを除く0文字以上の文字に一致します。単一のクラス名を指定する場合に使用します。
> * `?` は正確に1文字に一致します。
> 
{style = "tip"}

例：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

この例の設定では：

* 除外対象：
  * `InternalUtils` クラス。
  * `@InternalApi` アノテーションが付加された宣言。
* 包含対象：
  * `com.example.api` パッケージ内のすべて。
  * `@PublicApi` アノテーションが付加された宣言。

フィルタリングの詳細については、[Kotlin Gradle プラグイン API リファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/) を参照してください。

## サポートされていないターゲットに対する推論された変更の防止

マルチプラットフォームプロジェクトにおいて、ホストシステムがすべてのターゲットをコンパイルできない場合、Kotlin Gradle プラグインは利用可能なターゲットから ABI の変更を推論しようとします。これにより、後でより多くのターゲットをサポートするホストに切り替えたときに、誤った失敗が発生するのを防ぐことができます。

この動作を無効にするには、`build.gradle.kts` ファイルに以下を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

ターゲットがサポートされておらず、推論が無効になっている場合、`checkLegacyAbi` タスクは完全な ABI ダンプを生成できないため失敗します。この動作は、バイナリ互換性を損なう変更を見逃すリスクを負うよりも、タスクを失敗させたい場合に役立ちます。