[//]: # (title: ブラウザおよびDOM API)

[`kotlinx-browser`](https://github.com/Kotlin/kotlinx-browser) ライブラリを使用すると、ブラウザ固有の機能にアクセスできます。
このライブラリには、`document` や `window` といった典型的なトップレベルオブジェクトが含まれており、可能な限りそれらの機能に対してタイプセーフなラッパーを提供します。

代替手段として、Kotlin の型システムとうまくマッピングできない関数へのアクセスを提供するために、`dynamic` 型が使用されます。

ブラウザおよび DOM API を使用するには、プロジェクトの `build.gradle(.kts)` ファイルに依存関係として `kotlinx-browser` ライブラリを追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## DOMとの操作 {id="interaction-with-the-dom"}

ドキュメントオブジェクトモデル (DOM) を操作するには、変数 `document` を使用できます。例えば、このオブジェクトを通じてウェブサイトの背景色を設定できます。

```kotlin
document.bgColor = "FFAA12" 
```

`document` オブジェクトは、ID、名前、クラス名、タグ名などによって特定の要素を取得する方法も提供します。
返される要素はすべて `Element?` 型です。それらのプロパティにアクセスするには、適切な型にキャストする必要があります。
例えば、次のようなメールの `<input>` フィールドを持つ HTML ページがあるとします。

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

スクリプトが `<body>` タグの最後に含まれていることに注意してください。これにより、スクリプトがロードされる前に DOM が完全に利用可能であることが保証されます。

このセットアップにより、DOM の要素にアクセスできます。`input` フィールドのプロパティにアクセスするには、`getElementById` を呼び出し、それを `HTMLInputElement` にキャストします。そうすることで、`value` などのプロパティに安全にアクセスできるようになります。

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

この `input` 要素を参照するのと同様に、ページ上の他の要素にもアクセスし、適切な型にキャストすることができます。

## 次のステップ {id="what-s-next"}

DOM 内の要素を簡潔な方法で作成および構築する方法については、[タイプセーフ HTML DSL](typesafe-html-dsl.md) を確認してください。