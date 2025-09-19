[//]: # (title: ライフサイクル)

Compose Multiplatformにおけるコンポーネントのライフサイクルは、Jetpack Composeの[ライフサイクル](https://developer.android.com/topic/libraries/architecture/lifecycle)コンセプトから採用されています。ライフサイクルに対応したコンポーネントは、他のコンポーネントのライフサイクル状態の変化に反応でき、より整理され、多くの場合より軽量で、メンテナンスしやすいコードを作成するのに役立ちます。

Compose Multiplatformは共通の`LifecycleOwner`実装を提供します。これは、元のJetpack Composeの機能を他のプラットフォームに拡張し、共通コードでライフサイクル状態を監視するのに役立ちます。

マルチプラットフォームの`Lifecycle`実装を使用するには、`commonMain`ソースセットに以下の依存関係を追加してください。

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%"}

> マルチプラットフォームのLifecycle実装の変更は、当社の[最新情報](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)で追跡できます。または、[Compose Multiplatform changelog](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)で特定のEAPリリースを追跡することも可能です。
>
{style="tip"}

## 状態とイベント

ライフサイクル状態とイベントの流れ（[Jetpack lifecycle](https://developer.android.com/topic/libraries/architecture/lifecycle)と同じ）：

![Lifecycle diagram](lifecycle-states.svg){width="700"}

## ライフサイクルの実装

Composablesは通常、独自のライフサイクルを必要としません。共通の`LifecycleOwner`が、相互接続されたすべてのエンティティにライフサイクルを提供します。デフォルトでは、Compose Multiplatformによって作成されたすべてのComposableは同じライフサイクルを共有し、そのイベントを購読したり、ライフサイクル状態を参照したりできます。

> `LifecycleOwner`オブジェクトは[CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal)として提供されます。
> 特定のComposableサブツリーのライフサイクルを個別に管理したい場合は、独自の`LifecycleOwner`実装を[作成できます](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco)。
>
{style="tip"}

マルチプラットフォームのライフサイクルでコルーチンを扱う際、`Lifecycle.coroutineScope`の値は`Dispatchers.Main.immediate`の値に紐付けられており、これはデフォルトではデスクトップターゲットで利用できない場合があることを覚えておいてください。ライフサイクル内のコルーチンとフローがCompose Multiplatformで正しく機能するようにするには、プロジェクトに`kotlinx-coroutines-swing`の依存関係を追加してください。詳細については、[`Dispatchers.Main`のドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。

*   [ナビゲーションとルーティング](compose-navigation-routing.md)で、ナビゲーションコンポーネントにおけるライフサイクルの動作について学びます。
*   [共通ViewModel](compose-viewmodel.md)ページで、マルチプラットフォームViewModelの実装について詳しく学びます。

## Androidライフサイクルと他のプラットフォームのマッピング

### iOS

| ネイティブイベントと通知                  | ライフサイクルイベント | ライフサイクル状態の変化      |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

Wasmターゲットの制限により、ライフサイクルは以下のようになります。

*   アプリケーションは常にページにアタッチされているため、`CREATED`状態をスキップします。
*   ウェブページは通常、ユーザーがタブを閉じたときにのみ終了するため、`DESTROYED`状態には決して到達しません。

| ネイティブイベント                             | ライフサイクルイベント | ライフサイクル状態の変化 |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (表示状態に移行)     | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (非表示状態に移行) | `ON_STOP`       | `STARTED` → `CREATED`  |

### デスクトップ

| Swingリスナーコールバック | ライフサイクルイベント | ライフサイクル状態の変化      |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |