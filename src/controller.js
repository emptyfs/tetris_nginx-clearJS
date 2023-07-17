export default class Controller
    {
        constructor(game, view)
        {
            this.count = 0;
            this.game = game;
            this.view = view;
            this.interval_id = null;

            this.start_timer();

            document.addEventListener('keydown', this.key_down_uses.bind(this)); //регистрируем событие при ножатии на клавишу
            document.addEventListener('keyup', this.key_up_uses.bind(this));

            view.update_field(game.get_field());
        }

        update_timer()
        {
            //localStorage.setItem("best_scores", JSON.stringify(game.best_scores));
            this.stop_timer();
            this.game.move_figure_down();
            this.start_timer();
            this.update_view();
            //this.view.update_field(this.game.get_field());
        }

        update_view()
        {
            const state = this.game.get_field();

            if (state.is_game_over)
            {
                this.count++;
                if (this.count === 1)
                {
                    if (this.game.score > this.game.best_scores[4])
                    {
                        this.game.best_scores = this.game.table_scores(this.game.best_scores);
                        this.game.make_best_scores();
                        this.game.best_scores = this.game.table_scores(this.game.best_scores);
                    }
                }
                this.view.place_game_over(state);
            }
            else
            {
                this.view.update_field(state);
            }
        }

        stop_timer()
        {
            if (this.interval_id)
            {
                clearInterval(this.interval_id);
                this.interval_id = null;
            }
        }

        start_timer()
        {
            const speed = 1000 - this.game.get_field().level * 100; //скорость падения

            if (!this.interval_id)
            {
                this.interval_id = setInterval(() => {
                    this.update_timer();
                }, speed > 0? speed: 100);
            }
        }

        restart()
        {/*
            if (this.game.score > this.game.best_scores[4])
            {
                this.game.best_scores = this.game.table_scores(this.game.best_scores);
                this.game.make_best_scores();
                this.game.best_scores = this.game.table_scores(this.game.best_scores);
            }*/
            this.game.restart();
            this.start_timer();
            this.update_view();
        }

        key_up_uses(event)
        {
            switch (event.keyCode)
            {
                case 40: //стрелка вниз
                    this.start_timer();
                    break;
            }
        }

        key_down_uses(event)
        {
            const state = this.game.get_field();

            switch (event.keyCode) //keyCode возвращает числовой код клавиши
            {
                case 37: //НАЛЕВО(стрелка)
                    this.game.move_figure_left();
                    this.update_view();
                    break;
                case 38: //ВВЕРХ(стрелка)
                    this.game.rotate_figure();
                    this.update_view();
                    break;
                case 39: //ВПРАВО(стрелка)
                    this.game.move_figure_right();
                    this.update_view();
                    break;
                case 40: //ВНИЗ(стрелка)
                    this.stop_timer();
                    this.game.move_figure_down();
                    this.update_view();
                    break;
                case 16: //SHIFT
                    this.game.rotate_figure_left();
                    this.update_view();
                    break;
                case 13: //ENTER
                    if (state.is_game_over) {
                        this.restart();
                    }
                    break;
            }
        }
    }