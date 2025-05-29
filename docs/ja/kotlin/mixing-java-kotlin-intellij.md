[//]: # (title: 1つのプロジェクトでJavaとKotlinを混在させる – チュートリアル)

KotlinはJavaとの優れた相互運用性を提供し、最新のIDEはそれをさらに向上させます。
このチュートリアルでは、IntelliJ IDEAで同じプロジェクト内にKotlinとJavaのソースコードを両方使用する方法を学びます。
IntelliJ IDEAで新しいKotlinプロジェクトを開始する方法については、「[IntelliJ IDEAを始める](jvm-get-started.md)」を参照してください。

## 既存のKotlinプロジェクトにJavaソースコードを追加する

KotlinプロジェクトにJavaクラスを追加するのは非常に簡単です。新しいJavaファイルを作成するだけです。
プロジェクト内のディレクトリまたはパッケージを選択し、**File** | **New** | **Java Class** に移動するか、**Alt + Insert**/**Cmd + N** のショートカットを使用します。

![Add new Java class](new-java-class.png){width=400}

すでにJavaクラスを持っている場合は、それらをプロジェクトディレクトリにコピーするだけで済みます。

これで、KotlinからJavaクラスを利用したり、その逆も追加の操作なしに行うことができます。

例えば、以下のJavaクラスを追加すると:

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

Kotlin内の他の型と同様に、Kotlinから呼び出すことができます。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 既存のJavaプロジェクトにKotlinソースコードを追加する

既存のJavaプロジェクトにKotlinファイルを追加する方法もほぼ同じです。

![Add new Kotlin file class](new-kotlin-file.png){width=400}

このプロジェクトにKotlinファイルを初めて追加する場合、IntelliJ IDEAは必要なKotlinランタイムを自動的に追加します。

![Bundling Kotlin runtime](bundling-kotlin-option.png){width=350}

また、**Tools** | **Kotlin** | **Configure Kotlin in Project** からKotlinランタイムの設定を手動で開くこともできます。

## J2Kを使用して既存のJavaファイルをKotlinに変換する

Kotlinプラグインには、JavaファイルをKotlinに自動的に変換するJava to Kotlin変換ツール（_J2K_）も付属しています。
ファイルでJ2Kを使用するには、そのコンテキストメニューまたはIntelliJ IDEAの**Code**メニューで**Convert Java File to Kotlin File**をクリックします。

![Convert Java to Kotlin](convert-java-to-kotlin.png){width=500}

この変換ツールは完璧ではありませんが、ほとんどのJavaのボイラープレートコードをKotlinに変換する上で、かなりうまく機能します。しかし、手動での調整が時々必要になります。