<?php snippet('header') ?>
<?php snippet('menu') ?>

<section class="content blog">
  
  <h1><?php echo html($page->title()) ?></h1>
  <?php echo kirbytext($page->text()) ?>
  
  <?php foreach($page->children()->visible()->flip() as $article): ?>
  
  <article>
    <h1><?php echo html($article->title()) ?></h1>
    <p><?php echo excerpt($article->text(), 300) ?></p>
    <a href="<?php echo $article->url() ?>">Read more…</a>
  </article>

  <?php endforeach ?>

</section>

<?php snippet('footer') ?>