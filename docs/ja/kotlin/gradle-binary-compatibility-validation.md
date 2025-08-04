[//]: # (title: Kotlin Gradleプラグインでのバイナリ互換性検証)

<primary-label ref="experimental-general"/>

バイナリ互換性検証は、ライブラリ開発者が、ユーザーが新しいバージョンにアップグレードする際にコードを破壊しないようにするのに役立ちます。これは、スムーズなアップグレード体験を提供するだけでなく、ユーザーとの長期的な信頼を築き、ライブラリの継続的な採用を促進するためにも重要です。

> バイナリ互換性とは、ライブラリの2つのバージョンのコンパイル済みバイトコードが、再コンパイルを必要とせずに相互に実行可能であることを意味します。
> 
{style="tip"}

バージョン2.2.0以降、Kotlin Gradleプラグインはバイナリ互換性検証をサポートします。有効にすると、現在のコードからApplication Binary Interface (ABI) ダンプを生成し、以前のダンプと比較して違いを強調します。これらの変更をレビューして、潜在的にバイナリ互換性のない変更を見つけ、それらに対処するための措置を講じることができます。

## 有効にする方法

バイナリ互換性検証を有効にするには、`build.gradle.kts` ファイルの `kotlin{}` ブロックに以下を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 古いGradleバージョンとの互換性を確保するためにset()関数を使用します
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

プロジェクトにバイナリ互換性をチェックしたい複数のモジュールがある場合は、各モジュールを個別に設定してください。

## バイナリ互換性の問題をチェックする

コードに変更を加えた後に潜在的なバイナリ互換性の問題をチェックするには、IntelliJ IDEAで `checkLegacyAbi` Gradleタスクを実行するか、プロジェクトディレクトリで以下のコマンドを使用します。

```kotlin
./gradlew checkLegacyAbi
```

このタスクはABIダンプを比較し、検出された違いをエラーとして出力します。バイナリ互換性を維持するためにコードに変更を加える必要があるかどうか、出力を注意深く確認してください。

## 参照ABIダンプを更新する

Gradleが最新の変更をチェックするために使用する参照ABIダンプを更新するには、IntelliJ IDEAで `updateLegacyAbi` タスクを実行するか、プロジェクトディレクトリで以下のコマンドを使用します。

```kotlin
./gradlew updateLegacyAbi
```

変更が以前のバージョンとのバイナリ互換性を維持していると確信できる場合にのみ、参照ダンプを更新してください。

## フィルターを設定する

ABIダンプに含めるクラス、プロパティ、および関数を制御するためのフィルターを定義できます。除外ルールと包含ルールを追加するには、それぞれ `excluded {}` と `included {}` ブロックを持つ `filters {}` ブロックを使用します。

Gradleは、いずれの除外ルールにも一致しない場合にのみ、ABIダンプに宣言を含めます。包含ルールが定義されている場合、その宣言はいずれかのルールに一致するか、または少なくとも1つのメンバーが一致する必要があります。

ルールは以下に基づいて定義できます:

*   クラス、プロパティ、または関数の完全修飾名 (`byNames`)。
*   BINARYまたはRUNTIMEの[リテンション](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/)を持つアノテーションの名前 (`annotatedWith`)。

> 名前にワイルドカード `**`、`*`、および`?`を使用できます:
> *   `**` は、ピリオドを含む0個以上の文字に一致します。
> *   `*` は、ピリオドを除く0個以上の文字に一致します。単一のクラス名を指定するためにこれを使用します。
> *   `?` は、正確に1つの文字に一致します。
> 
{style = "tip"}

例:

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

```kotlin
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

この例では:

*   除外するもの:
    *   `InternalUtils` クラス。
    *   `@InternalApi` でアノテーションされた宣言。
*   含めるもの:
    *   `com.example.api` パッケージ内のすべて。
    *   `@PublicApi` でアノテーションされた宣言。

フィルタリングの詳細については、[Kotlin GradleプラグインAPIリファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/)を参照してください。

## サポートされていないターゲットに対する推論された変更を防ぐ

マルチプラットフォームプロジェクトでは、ホストシステムがすべてのターゲットをコンパイルできない場合、Kotlin Gradleプラグインは、利用可能なターゲットからABIの変更を推論しようとします。これにより、後でより多くのターゲットをサポートするホストに切り替えたときに、誤った失敗を回避できます。

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

```kotlin
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

ターゲットがサポートされておらず、推論が無効になっている場合、`checkLegacyAbi` タスクは完全なABIダンプを生成できないため失敗します。この動作は、バイナリ互換性のない変更を見逃すリスクを負うよりも、タスクが失敗する方が良い場合に役立つかもしれません。