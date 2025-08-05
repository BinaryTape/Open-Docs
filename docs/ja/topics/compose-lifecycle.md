[//]: # (title: ライフサイクル)

Compose Multiplatformにおけるコンポーネントのライフサイクルは、Jetpack Composeのライフサイクル（[lifecycle](https://developer.android.com/topic/libraries/architecture/lifecycle)）の概念から採用されています。
ライフサイクル対応コンポーネントは、他のコンポーネントのライフサイクル状態の変化に反応し、より整理され、しばしば軽量で、保守しやすいコードを作成するのに役立ちます。

Compose Multiplatformは共通の`LifecycleOwner`実装を提供します。これは、元のJetpack Composeの機能を他のプラットフォームに拡張し、共通コードでライフサイクル状態を監視するのに役立ちます。

マルチプラットフォームの`Lifecycle`実装を使用するには、`commonMain`ソースセットに以下の依存関係を追加します。

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

> マルチプラットフォームのLifecycle実装の変更は、[新機能](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)で追跡できます。または、[Compose Multiplatformチェンジログ](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)で特定のEAPリリースを追跡してください。
>
{style="tip"}

## 状態とイベント

ライフサイクル状態とイベントの流れ（[Jetpackライフサイクル](https://developer.android.com/topic/libraries/architecture/lifecycle)と同様）：

![Lifecycle diagram](lifecycle-states.svg){width="700"}

## ライフサイクルの実装

Composablesは通常、個別のライフサイクルを必要としません。共通の`LifecycleOwner`が、相互接続されたすべてのエンティティにライフサイクルを提供します。デフォルトでは、Compose Multiplatformによって作成されたすべてのcomposableは同じライフサイクルを共有します。これにより、そのイベントを購読したり、ライフサイクル状態を参照したりできます。

> `LifecycleOwner`オブジェクトは、[CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal)として提供されます。
> 特定のcomposableサブツリーのライフサイクルを個別に管理したい場合は、独自の`LifecycleOwner`実装を[作成](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco)できます。
>
{style="tip"}

マルチプラットフォームのライフサイクルでコルーチンを扱う際、`Lifecycle.coroutineScope`の値は`Dispatchers.Main.immediate`の値に結び付けられていることを覚えておいてください。この値は、デフォルトではデスクトップターゲットで利用できない場合があります。
ライフサイクル内のコルーチンとフローがCompose Multiplatformで正しく機能するようにするには、プロジェクトに`kotlinx-coroutines-swing`の依存関係を追加します。
詳細については、[`Dispatchers.Main`ドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。

* ナビゲーションコンポーネントにおけるライフサイクルの動作については、[](compose-navigation-routing.md)で学習してください。
* マルチプラットフォームViewModelの実装の詳細については、[](compose-viewmodel.md)ページで学習してください。

## Androidライフサイクルと他のプラットフォームのマッピング

### iOS

| ネイティブイベントと通知          | ライフサイクルイベント | ライフサイクル状態の変更 |
|---------------------------------|-----------------|------------------------|
| `viewDidDisappear`              | `ON_STOP`       | `STARTED` → `CREATED`  |
| `viewWillAppear`                | `ON_START`      | `CREATED` → `STARTED`  |
| `willResignActive`              | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `didBecomeActive`               | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `didEnterBackground`            | `ON_STOP`       | `STARTED` → `CREATED`  |
| `willEnterForeground`           | `ON_START`      | `CREATED` → `STARTED`  |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

Wasmターゲットの制限により、ライフサイクルは以下のようになります。

* アプリケーションが常にページにアタッチされているため、`CREATED`状態をスキップします。
* ウェブページは通常、ユーザーがタブを閉じるときにのみ終了されるため、`DESTROYED`状態に到達することはありません。

| ネイティブイベント | ライフサイクルイベント | ライフサイクル状態の変更 |
|--------------|-----------------|------------------------|
| `blur`       | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `focus`      | `ON_RESUME`     | `STARTED` → `RESUMED`  |

### デスクトップ

| Swingリスナーコールバック | ライフサイクルイベント | ライフサイクル状態の変更 |
|--------------------------|-----------------|------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`  |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`  |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |