---
title: Androidにおける複数のKoinモジュール
---

Koinを使用すると、定義をモジュールで記述します。このセクションでは、モジュールを宣言し、整理し、リンクする方法を説明します。

## 複数のモジュールの使用

コンポーネントは必ずしも同じモジュールにある必要はありません。モジュールは、定義を整理するのに役立つ論理的な空間であり、他のモジュールの定義に依存することもできます。定義は遅延評価され、コンポーネントがそれらを要求したときにのみ解決されます。

分離されたモジュールにリンクされたコンポーネントの例を見てみましょう。

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // ComponentAのシングルトン
    single { ComponentA() }
}

val moduleB = module {
    // ComponentAインスタンスにリンクされたComponentBのシングルトン
    single { ComponentB(get()) }
}
```

Koinコンテナを起動するときに、使用するモジュールのリストを宣言するだけです。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
            modules(moduleA, moduleB)
        }
        
    }
}
```
Gradleモジュールごとに自分で整理し、複数のKoinモジュールをまとめるのはあなた次第です。

> 詳細については、[Koinモジュールセクション](/docs/reference/koin-core/modules)を確認してください。

## モジュールのインクルード (3.2以降)

`Module`クラスに新しい関数`includes()`が追加され、他のモジュールを整理された構造化された方法で含めることで、モジュールを構成できるようになりました。

この新機能の主なユースケースは次の2つです。
- 大規模なモジュールをより小さく、より特化したモジュールに分割する。
- モジュール化されたプロジェクトで、モジュールの可視性をよりきめ細かく制御できる（以下の例を参照）。

どのように機能するのでしょうか？いくつかのモジュールを取り上げ、それらを`parentModule`に含めてみましょう。

```kotlin
// `:feature` モジュール
val childModule1 = module {
    /* その他の定義はこちら。 */
}
val childModule2 = module {
    /* その他の定義はこちら。 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` モジュール
startKoin { modules(parentModule) }
```

すべてのモジュールを明示的にセットアップする必要がないことに注目してください。`parentModule`を含めることで、`includes`で宣言されたすべてのモジュール（`childModule1`と`childModule2`）が自動的にロードされます。言い換えれば、Koinは実質的に`parentModule`、`childModule1`、`childModule2`をロードしていることになります。

注目すべき重要な点は、`includes`を使用して`internal`および`private`モジュールも追加できることです。これにより、モジュール化されたプロジェクトで何を公開するかについて柔軟性が得られます。

:::info
モジュールのロードが最適化され、すべてのモジュールグラフがフラット化され、モジュールの定義が重複するのを回避できるようになりました。
:::

最後に、複数のネストされたモジュールや重複するモジュールを含めることができ、Koinは含まれるすべてのモジュールをフラット化し、重複を削除します。

```kotlin
// :feature モジュール
val dataModule = module {
    /* その他の定義はこちら。 */
}
val domainModule = module {
    /* その他の定義はこちら。 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` モジュール
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

`dataModule`、`domainModule`、`featureModule1`、`featureModule2`のすべてのモジュールが一度だけ含まれることに注目してください。

## バックグラウンドモジュールロードによる起動時間の短縮

Koinモジュールを「遅延」として宣言できるようになり、リソースの事前割り当てをトリガーするのを避け、Koinの起動時にバックグラウンドでそれらをロードできます。これにより、バックグラウンドでロードされる遅延モジュールを渡すことで、Androidの起動プロセスをブロックするのを避けるのに役立ちます。

- `lazyModule` - Koinモジュールの遅延Kotlinバージョンを宣言します
- `Module.includes` - 遅延モジュールのインクルードを許可します
- `KoinApplication.lazyModules` - プラットフォームのデフォルトの`Dispatchers`に従って、コルーチンでバックグラウンドで遅延モジュールをロードします
- `Koin.waitAllStartJobs` - 開始ジョブの完了を待ちます
- `Koin.runOnKoinStarted` - 開始完了後にブロックコードを実行します

良い例は常に理解を深めるのに役立ちます。

```kotlin

// 遅延ロードされるモジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同期モジュールのロード
    modules(m1)
    // バックグラウンドで遅延モジュールをロード
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 開始完了を待つ
koin.waitAllStartJobs()

// または開始後にコードを実行する
koin.runOnKoinStarted { koin ->
    // バックグラウンドロード完了後に実行
}